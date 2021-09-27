import 'should';
import { Litecoin } from './litecoin/litecoin';
import { Docker } from '../util/docker';
import { CryptoNodeData } from '../interfaces/crypto-node';
import { NetworkType, NodeType, Status } from '../constants';
import { v4 as uuid } from 'uuid';
import { ChildProcess } from 'child_process';
import { timeout } from '../util';
import { Bitcoin } from './bitcoin/bitcoin';
import { Dash } from './dash/dash';
import { BitcoinCash } from './bitcoin-cash/bitcoin-cash';
import { LBRY } from './lbry/lbry';
import { Ethereum } from './ethereum/ethereum';
import { Xdai } from './xdai/xdai';
import { BinanceSC } from './binance-sc/binance-sc';
import { Avalanche } from './avalanche/avalanche';
import { Pocket } from './pocket/pocket';
import { Fuse } from './fuse/fuse';

const chains: [{name: string, constructor: any}] = [
  {name: 'Bitcoin', constructor: Bitcoin},
  {name: 'BitcoinCash', constructor: BitcoinCash},
  {name: 'Dash', constructor: Dash},
  {name: 'LBRY', constructor: LBRY},
  {name: 'Litecoin', constructor: Litecoin},
  {name: 'Ethereum', constructor: Ethereum},
  {name: 'BinanceSC', constructor: BinanceSC},
  {name: 'Xdai', constructor: Xdai},
  {name: 'Avalanche', constructor: Avalanche},
  {name: 'Pocket', constructor: Pocket},
  {name: 'Fuse', constructor: Fuse},
];

chains.forEach(({ name, constructor: NodeConstructor }) => {

  describe(name, function() {

    this.timeout(30000);

    const docker = new Docker({});
    let node;
    const initialNodeData: CryptoNodeData = {
      id: 'test-id',
      version: '1.2.3',
      dockerImage: 'some image',
      network: NodeConstructor.networkTypes[0],
      peerPort: 3344,
      rpcPort: 4455,
      rpcUsername: 'some username',
      rpcPassword: 'some password',
      client: NodeConstructor.clients[0],
      dockerCpus: 4,
      dockerMem: 4096,
      dockerNetwork: 'some network',
      dataDir: '/some/dir',
      walletDir: '/some/wallet/dir/',
      configPath: '/some/config/path',
    };

    it('should be a constructor', function() {
      NodeConstructor.should.be.a.constructor();
    });
    describe(`static ${name}.versions`, function () {
      it('should return an array of version data objects', function () {
        const versions = NodeConstructor.versions();
        versions.should.be.an.Array();
        versions.forEach(v => {
          v.should.be.an.Object();
          v.version.should.be.a.String();
          v.image.should.be.a.String();
          v.dataDir.should.be.a.String();
          v.walletDir.should.be.a.String();
          v.configPath.should.be.a.String();
          const runtimeArgs = v.generateRuntimeArgs(new NodeConstructor({}));
          runtimeArgs.should.be.a.String();
        });
      });
    });
    describe(`static ${name}.nodeTypes`, function() {
      it('should be an array of node type strings', function() {
        NodeConstructor.nodeTypes.should.be.an.Array();
        NodeConstructor.nodeTypes.length.should.be.greaterThan(0);
        NodeConstructor.nodeTypes.every(t => NodeType[t]).should.be.True();
      });
    });
    describe(`static ${name}.networkTypes`, function() {
      it('should be an array of network type strings', function() {
        NodeConstructor.networkTypes.should.be.an.Array();
        NodeConstructor.networkTypes.length.should.be.greaterThan(0);
        NodeConstructor.networkTypes.every(t => NetworkType[t]).should.be.True();
      });
    });
    describe(`static ${name}.defaultRPCPort`, function() {
      it('should be an object mapping network type to port number', function() {
        NodeConstructor.defaultRPCPort.should.be.an.Object();
        const keys = Object.keys(NodeConstructor.defaultRPCPort);
        keys.length.should.be.greaterThan(0);
        keys.length.should.equal(NodeConstructor.networkTypes.length);
        // @ts-ignore
        keys.every(k => NetworkType[k]).should.be.True();
        Object.values(NodeConstructor.defaultRPCPort).every(v => v.should.be.a.Number());
      });
    });
    describe(`static ${name}.defaultPeerPort`, function() {
      it('should be an object mapping network type to port number', function() {
        NodeConstructor.defaultPeerPort.should.be.an.Object();
        const keys = Object.keys(NodeConstructor.defaultPeerPort);
        keys.length.should.be.greaterThan(0);
        keys.length.should.equal(NodeConstructor.networkTypes.length);
        // @ts-ignore
        keys.every(k => NetworkType[k]).should.be.True();
        Object.values(NodeConstructor.defaultPeerPort).every(v => v.should.be.a.Number());
      });
    });
    describe(`static ${name}.defaultCPUs`, function() {
      it('should be the default CPU number', function() {
        NodeConstructor.defaultCPUs.should.be.a.Number();
        NodeConstructor.defaultCPUs.should.be.greaterThan(0);
      });
    });
    describe(`static ${name}.defaultMem`, function() {
      it('should be the default memory size', function() {
        NodeConstructor.defaultMem.should.be.a.Number();
        NodeConstructor.defaultMem.should.be.greaterThan(0);
      });
    });
    describe(`static ${name}.generateConfig()`, function() {
      it('should generate a default config file', function() {
        const config = NodeConstructor.generateConfig();
        config.should.be.a.String();
        config.length.should.be.greaterThan(0);
      });
    });
    describe(`${name}.toObject()`, function() {
      it('should return a node data object', async function() {
        node = new NodeConstructor(initialNodeData);
        const nodeData = node.toObject();
        nodeData.should.be.an.Object();
        for(const key of Object.keys(initialNodeData)) {
          nodeData[key].should.equal(initialNodeData[key]);
        }
      });
    });
    describe(`${name}.generateConfig()`, async function() {
      it('should return an instance-specific config', async function() {
        node = new NodeConstructor(initialNodeData);
        const config = node.generateConfig();
        config.should.be.a.String();
        config.length.should.be.greaterThan(0);
        config.includes(initialNodeData.peerPort).should.be.True();
        config.includes(initialNodeData.rpcPort).should.be.True();
      });
    });

    NodeConstructor.clients.forEach(client => {
      NodeConstructor.networkTypes.forEach(network => {
        describe(`${name}.start() with ${client} client & ${network} network`, function() {
          it('should start a node', async function() {
            const id = uuid();
            node = new NodeConstructor({
              id,
              network,
              client,
            });
            node.start().should.be.a.Promise();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await docker.kill(id);
          });
          it('should resolve with a ChildProcess', async function() {
            node = new NodeConstructor({
              network,
              client,
            });
            const instance = await node.start();
            instance.should.be.an.instanceOf(ChildProcess);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const items = await docker.ps
            await new Promise(resolve => {
              node._instance.on('close', resolve);
              node._instance.kill();
            });
          });
        });
        describe(`${name}.stop() with ${client} client & ${network} network`, async function() {
          it('should stop a node', async function() {
            node = new NodeConstructor({
              network,
              client,
            });
            await node.start();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await node.stop();
            node._instance.exitCode.should.be.a.Number();
          });
        });
        describe(`${name} runtime methods with ${client} client & ${network} network`, function() {

          this.timeout(60000 * 30);

          before(async function() {
            node = new NodeConstructor({
              network,
              client,
            });
            await node.start();
            // Give the node a little time to connect and get up and running
            await timeout(60000 * .5);
          });

          describe(`${name}.rpcGetVersion()`, function() {
            it('should resolve with the client version', async function() {
              const version = await node.rpcGetVersion();
              version.should.be.a.String();
              version.should.equal(node.version);
            });
          });
          describe(`${name}.rpcGetBlockCount()`, function() {
            it('should resolve with the current block count number', async function() {
              const blockCount = await node.rpcGetBlockCount();
              blockCount.should.be.a.Number();
            });
          });
          describe(`${name}.getCPUUsage()`, function() {
            it('should resolve with the percentage of allocated CPUs used', async function() {
              const percent = await node.getCPUUsage();
              percent.should.be.a.String();
              /^\d+/.test(percent).should.be.True();
            });
          });
          describe(`${name}.getMemUsage()`, function() {
            it('should resolve with the percentage of allocated memory used, the amount used, and the amount allocated', async function() {
              const res = await node.getMemUsage();
              res.should.be.an.Array();
              res.length.should.equal(3);
              res.forEach(val => val.should.be.a.String());
              /\d+%/.test(res[0]).should.be.True();
              res.slice(1).forEach(val => /^\d+/.test(val).should.be.True());
            });
          });
          describe(`${name}.getStartTime()`, function() {
            it('should resolve with an ISO string of when the container began running', async function() {
              const startTime = await node.getStartTime();
              startTime.should.be.a.String();
              const time = Date.parse(startTime);
              time.should.be.greaterThan(0);
            });
          });
          describe(`${name}.getStatus()`, function() {
            it('should resolve with the current node status', async function() {
              const runningStatus = await node.getStatus();
              runningStatus.should.be.a.String();
              runningStatus.should.not.equal(Status.STOPPED);
              Object.values(Status).includes(runningStatus).should.be.True();
              await node.stop();
              const stoppedStatus = await node.getStatus();
              stoppedStatus.should.equal(Status.STOPPED);
            });
          });
        });
      });
    });
  });
});
