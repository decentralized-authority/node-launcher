import 'should';
import { Litecoin } from './litecoin/litecoin';
import { Docker } from '../util/docker';
import { CryptoNodeData } from '../interfaces/crypto-node';
import { DockerEvent, NetworkType, NodeEvent, NodeType, Status } from '../constants';
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
import { isNull } from 'lodash';
import { Harmony } from './harmony/harmony';
import { OKEX } from './oec/okex';

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
  {name: 'Harmony', constructor: Harmony},
  {name: 'OEC', constructor: OKEX},
];

chains.forEach(({ name, constructor: NodeConstructor }) => {

  describe(name, function() {

    this.timeout(30000);

    const docker = new Docker({
      logDriver: 'none',
    });
    // docker.on(DockerEvent.INFO, console.log);

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
      dockerCPUs: 4,
      dockerMem: 4096,
      dockerNetwork: 'some network',
      dataDir: '/some/dir',
      walletDir: '/some/wallet/dir/',
      configDir: '/some/config/path',
    };

    it('should be a constructor', function() {
      NodeConstructor.should.be.a.constructor();
    });
    describe(`static ${name}.versions`, function() {
      it('should return an array of version data objects', function () {
        const versions = NodeConstructor.versions(NodeConstructor.clients[0], NodeConstructor.networkTypes[0]);
        versions.should.be.an.Array();
        versions.forEach(v => {
          v.should.be.an.Object();
          v.version.should.be.a.String();
          v.image.should.be.a.String();
          v.dataDir.should.be.a.String();
          v.walletDir.should.be.a.String();
          v.configDir.should.be.a.String();
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
    describe(`static ${name}.getAvailableUpgrade()`, function() {
      it('should return new version data if available', function() {
        const versions1 = [
          {version: '2345'},
          {version: '1234'},
        ];
        const res1 = NodeConstructor.getAvailableUpgrade({version: versions1[0].version}, versions1);
        isNull(res1).should.be.true();
        const versions2 = [
          {version: '2345', breaking: true},
          {version: '1234'},
        ];
        const res2 = NodeConstructor.getAvailableUpgrade({version: versions2[0].version}, versions2);
        isNull(res2).should.be.true();
        const versions3 = [
          {version: '4123'},
          {version: '3412'},
          {version: '2341'},
          {version: '1234'},
        ];
        const res3 = NodeConstructor.getAvailableUpgrade({version: versions3[versions3.length - 1].version}, versions3);
        res3.version.should.equal(versions3[0].version);

        const versions4 = [
          {version: '34512'},
          {version: '23451', breaking: true},
          {version: '12345', breaking: true},
          {version: '4123'},
          {version: '3412', breaking: true},
          {version: '2341'},
          {version: '1234'},
        ];
        NodeConstructor.getAvailableUpgrade(
          {version: '1234'},
          versions4
        ).version.should.equal('3412');
        NodeConstructor.getAvailableUpgrade(
          {version: '1234'},
          versions4
        ).version.should.equal('3412');
        NodeConstructor.getAvailableUpgrade(
          {version: '1234'},
          versions4,
          true,
        ).version.should.equal('2341');
        isNull(NodeConstructor.getAvailableUpgrade(
          {version: '12345'},
          versions4,
          true,
        )).should.be.true();
      });
    });

    describe(`static ${name}.upgradeNode()`, function() {
      it('should upgrade a node to a newer version', async function() {
        const versionData = {
          version: '2345',
          clientVersion: '3456',
          image: 'some-image',
        };
        {
          node = new NodeConstructor(initialNodeData);
          const res = await NodeConstructor.upgradeNode(node, versionData);
          res.should.be.true();
          node.version.should.equal(versionData.version);
          node.clientVersion.should.equal(versionData.clientVersion);
          node.dockerImage.should.equal(versionData.image);
        }
        { // test a successful upgrade
          node = new NodeConstructor(initialNodeData);
          let upgradeCalled = false;
          versionData.upgrade = async function() {
            upgradeCalled = true;
            return true;
          };
          const res = await NodeConstructor.upgradeNode(node, versionData);
          res.should.be.true();
          upgradeCalled.should.be.true();
          node.version.should.equal(versionData.version);
          node.clientVersion.should.equal(versionData.clientVersion);
          node.dockerImage.should.equal(versionData.image);
        }
        { // test an unsuccessful upgrade
          node = new NodeConstructor(initialNodeData);
          const origVersion = node.version;
          const origClientVersion = node.clientVersion;
          const origDockerImage = node.dockerImage;
          let upgradeCalled = false;
          versionData.upgrade = async function() {
            upgradeCalled = true;
            return false;
          };
          const res = await NodeConstructor.upgradeNode(node, versionData);
          res.should.be.false();
          upgradeCalled.should.be.true();
          node.version.should.equal(origVersion);
          node.clientVersion.should.equal(origClientVersion);
          node.dockerImage.should.equal(origDockerImage);
        }
        { // test an unsuccessful upgrade that throws an error
          node = new NodeConstructor(initialNodeData);
          const origVersion = node.version;
          const origClientVersion = node.clientVersion;
          const origDockerImage = node.dockerImage;
          let upgradeCalled = false;
          versionData.upgrade = async function() {
            upgradeCalled = true;
            throw new Error('something');
          };
          await NodeConstructor.upgradeNode(node, versionData).should.be.rejected();
          upgradeCalled.should.be.true();
          node.version.should.equal(origVersion);
          node.clientVersion.should.equal(origClientVersion);
          node.dockerImage.should.equal(origDockerImage);
        }
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
            }, docker);
            // node.on(NodeEvent.OUTPUT, console.log);
            // node.on(NodeEvent.ERROR, console.error);
            // node.on(NodeEvent.CLOSE, console.log);
            const res = await node.start();
            res.should.be.an.instanceOf(ChildProcess);
            await new Promise(resolve => setTimeout(resolve, 2000));
            await docker.kill(id);
          });
          it('should resolve with a ChildProcess', async function() {
            node = new NodeConstructor({
              network,
              client,
            }, docker);
            // node.on(NodeEvent.OUTPUT, console.log);
            // node.on(NodeEvent.ERROR, console.error);
            // node.on(NodeEvent.CLOSE, console.log);
            const instance = await node.start();
            instance.should.be.an.instanceOf(ChildProcess);
            await new Promise(resolve => setTimeout(resolve, 2000));
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
            }, docker);
            await node.start();
            await new Promise(resolve => setTimeout(resolve, 2000));
            await node.stop();
            node._instance.exitCode.should.be.a.Number();
          });
        });
        describe(`${name} runtime methods with ${client} client & ${network} network`, function() {

          this.timeout(60000 * 30);

          let remoteNode;

          before(async function() {
            node = new NodeConstructor({
              network,
              client,
            }, docker);

            // Log output
            // node.on(NodeEvent.OUTPUT, console.log);

            await node.start();
            remoteNode = new NodeConstructor({
              network,
              client,
              rpcUsername: node.rpcUsername,
              rpcPassword: node.rpcPassword,
              rpcPort: node.rpcPort,
              remote: true,
              remoteDomain: 'localhost',
              remoteProtocol: 'http',
            });
            // node
            //   .on(NodeEvent.ERROR, console.error)
            //   .on(NodeEvent.OUTPUT, console.log)
            //   .on(NodeEvent.CLOSE, (exitCode: number) => console.log(`Exited with code ${exitCode}`));

            // Give the node a little time to connect and get up and running
            await timeout(60000 * .5);
          });

          describe(`${name}.rpcGetVersion()`, function() {
            it('should resolve with the client version', async function() {
              const version = await node.rpcGetVersion();
              version.should.be.a.String();
              version.should.equal(node.clientVersion);
            });
          });
          describe(`Remote ${name}.rpcGetVersion()`, function() {
            it('should resolve with the remote client version', async function() {
              const version = await remoteNode.rpcGetVersion();
              version.should.be.a.String();
              version.should.equal(node.clientVersion);
            });
          });
          describe(`${name}.isRunning() while running`, function() {
            it('should resolve with a boolean indicating that the node is running', async function() {
              const localRunningRes = await node.isRunning();
              localRunningRes.should.be.True();
              const remoteRunningRes = await remoteNode.isRunning();
              remoteRunningRes.should.be.True();
            });
          });
          describe(`${name}.rpcGetBlockCount()`, function() {
            it('should resolve with the current block count number', async function() {
              const blockCount = await node.rpcGetBlockCount();
              blockCount.should.be.a.String();
            });
          });
          describe(`Remote ${name}.rpcGetBlockCount()`, function() {
            it('should resolve with the current block count number', async function() {
              const blockCount = await remoteNode.rpcGetBlockCount();
              blockCount.should.be.a.String();
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
          describe(`Remote ${name}.getStatus() running`, function() {
            it('should resolve with the current running remote node status', async function() {
              const currentStatus = await remoteNode.getStatus();
              currentStatus.should.be.a.String();
              currentStatus.should.not.equal(Status.STOPPED);
              Object.values(Status).includes(currentStatus).should.be.True();
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
          describe(`Remote ${name}.getStatus() stopped`, function() {
            it('should resolve with the current stopped remote node status', async function() {
              const currentStatus = await remoteNode.getStatus();
              currentStatus.should.be.a.String();
              currentStatus.should.equal(Status.STOPPED);
            });
          });
          describe(`${name}.isRunning() while stopped`, function() {
            it('should resolve with a boolean indicating that the node is stopped', async function() {
              const localStoppedRes = await node.isRunning();
              localStoppedRes.should.be.False();
              const remoteStoppedRes = await remoteNode.isRunning();
              remoteStoppedRes.should.be.False();
            });
          });
        });
      });
    });
  });
});
