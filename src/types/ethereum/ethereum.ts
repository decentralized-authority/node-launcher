import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Bitcoin } from '../bitcoin/bitcoin';
import { filterVersionsByNetworkType } from '../../util';

const coreConfig = `
[Eth]
NetworkId = 1

[Node]
DataDir = "/root/.ethereum"
KeyStoreDir = "/root/keystore"
HTTPHost = "0.0.0.0"
HTTPPort = {{RPC_PORT}}
HTTPVirtualHosts = ["*"]
HTTPModules = ["net", "web3", "eth"]

[Node.P2P]
ListenAddr = ":{{PEER_PORT}}"
`;

interface EthVersionDockerImage extends VersionDockerImage {
  generateRpcRuntimeArgs?: (data: CryptoNodeData) => string
}

export class Ethereum extends Bitcoin {

  static versions(client: string, networkType: string): EthVersionDockerImage[] {
    client = client || Ethereum.clients[0];
    let versions: EthVersionDockerImage[];
    switch(client) {
      case NodeClient.GETH:
        versions = [
          {
            version: '1.10.14',
            clientVersion: '1.10.14',
            image: 'ethereum/client-go:v1.10.14',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: true,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath} --syncmode snap` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
            async upgrade(data: CryptoNodeData): Promise<boolean> {
              const { configPath } = data;
              if(configPath && (await fs.pathExists(configPath))) {
                const conf = await fs.readFile(configPath, 'utf8');
                const newConf = conf
                  .split('\n')
                  .map(str => str.trim())
                  .filter(str => !/^SyncMode\s*=/.test(str))
                  .join('\n');
                await fs.writeFile(configPath, newConf, 'utf8');
              }
              return true;
            },
          },
          {
            version: '1.10.13',
            clientVersion: '1.10.13',
            image: 'ethereum/client-go:v1.10.13',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.12',
            clientVersion: '1.10.12',
            image: 'ethereum/client-go:v1.10.12',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.11',
            clientVersion: '1.10.11',
            image: 'ethereum/client-go:v1.10.11',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.10',
            clientVersion: '1.10.10',
            image: 'ethereum/client-go:v1.10.10',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.3',
            clientVersion: '1.10.3',
            image: 'ethereum/client-go:v1.10.3',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
        ];
        break;
      case NodeClient.ERIGON:
        versions = [
          {
            version: '2021.12.02',
            clientVersion: '2021.12.02',
            image: 'thorax/erigon:v2021.12.02',
            dataDir: '/home/erigon/.local/share/erigon',
            walletDir: '',
            configPath: '',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --metrics                       \
                              --metrics.addr=0.0.0.0          \
                              --metrics.port=6060             \
                              --private.api.addr=0.0.0.0:9090 \
                              --pprof --pprof.addr=0.0.0.0    \
                              --pprof.port=6061`;
            },
            generateRpcRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` rpcdaemon --datadir=${data.dataDir}          \
                                --private.api.addr=${data.id}:9090  \
                                --http.addr=0.0.0.0                 \
                                --http.vhosts='*'                   \
                                --http.corsdomain='*'               \
                                --http.api='eth,debug,net,trace' `;
            }
          },
        ];
        break;
      default:
        versions = [];
    }
    return filterVersionsByNetworkType(networkType, versions);
  }

  static clients = [
    NodeClient.GETH,
  ];

  static nodeTypes = [
    NodeType.FULL,
    NodeType.ARCHIVAL,
  ];

  static networkTypes = [
    NetworkType.MAINNET,
    NetworkType.RINKEBY,
  ];

  static roles = [
    Role.NODE,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 8545,
    [NetworkType.RINKEBY]: 18545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8546,
    [NetworkType.RINKEBY]: 18546,
  };

  static defaultCPUs = 8;

  static defaultMem = 16384;

  static generateConfig(client = Ethereum.clients[0], network = NetworkType.MAINNET, peerPort = Ethereum.defaultPeerPort[NetworkType.MAINNET], rpcPort = Ethereum.defaultRPCPort[NetworkType.MAINNET]): string {
    switch(client) {
      case NodeClient.GETH:
        return coreConfig
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .trim();
      default:
        return '';
    }
  }

  id: string;
  ticker = 'eth';
  name = 'Ethereum';
  version: string;
  clientVersion: string;
  archival = false;
  dockerImage: string;
  network: string;
  peerPort: number;
  rpcPort: number;
  rpcUsername: string;
  rpcPassword: string;
  client: string;
  dockerCPUs = Ethereum.defaultCPUs;
  dockerMem = Ethereum.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configPath = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  role = Ethereum.roles[0];
  _rpcInstance?: ChildProcess;

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Ethereum.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Ethereum.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Ethereum.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.walletDir;
    this.configPath = data.configPath || this.configPath;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Ethereum.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    if(docker)
      this._docker = docker;
  }

  rpcContainerName(): string {
    return `${this.id}-rpc`;
  }

  async start(): Promise<ChildProcess> {
    const versions = Ethereum.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);

    switch(this.client) {
      case NodeClient.ERIGON:
        return this.startErigon(versionData);

      case NodeClient.GETH:
        return this.startGeth(versionData);
    }

    throw new Error(`Cannot start ETH node for unknown client: ${this.client}`)
  }

  private async startErigon(versionData: EthVersionDockerImage): Promise<ChildProcess> {
    const { dataDir: containerDataDir } = versionData;
    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    await fs.ensureDir(dataDir);

    const nodeContainerArgs = [
      '-i',
      '--rm',
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.peerPort}:${this.peerPort}/tcp`,
      '-p', `${this.peerPort}:${this.peerPort}/udp`,
      '-v', `${dataDir}:${containerDataDir}`,
    ];

    const rpcContainerArgs = [
      '-i',
      '--rm',
      '--memory', '2048MB', // TODO: parameterize this
      '--cpus', '2', // TODO: parameterize this
      '--name', this.rpcContainerName(),
      '--network', this.dockerNetwork,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
      '-v', `${dataDir}:${containerDataDir}`,
    ];

    await this._docker.pull(this.dockerImage, str => this._logOutput(str));
    await this._docker.createNetwork(this.dockerNetwork);

    const nodeInstance = this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      nodeContainerArgs,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );

    let rpcArgs ='';
    if(versionData.generateRpcRuntimeArgs !== undefined) {
      rpcArgs = versionData.generateRpcRuntimeArgs(this);
    }

    const rpcInstance = this._docker.run(
      this.dockerImage + rpcArgs,
      rpcContainerArgs,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );

    this._instance = nodeInstance;
    this._rpcInstance = rpcInstance
    return nodeInstance;
  }

  private async startGeth(versionData: EthVersionDockerImage): Promise<ChildProcess> {
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configPath: containerConfigPath,
    } = versionData;
    let args = [
      '-i',
      '--rm',
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
      '-p', `${this.peerPort}:${this.peerPort}`,
    ];
    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    args = [...args, '-v', `${dataDir}:${containerDataDir}`];
    await fs.ensureDir(dataDir);

    const walletDir = this.walletDir || path.join(tmpdir, uuid());
    args = [...args, '-v', `${walletDir}:${containerWalletDir}`];
    await fs.ensureDir(walletDir);

    const configPath = this.configPath || path.join(tmpdir, uuid());
    const configExists = await fs.pathExists(configPath);
    if(!configExists)
      await fs.writeFile(configPath, this.generateConfig(), 'utf8');
    args = [...args, '-v', `${configPath}:${containerConfigPath}`];

    await this._docker.pull(this.dockerImage, str => this._logOutput(str));

    await this._docker.createNetwork(this.dockerNetwork);
    const instance = this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      args,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );
    this._instance = instance;
    return instance;
  }

  async stop(): Promise<void> {

    try {
      await this._docker.kill(this.rpcContainerName());
    } catch(err) {
      this._logError(err);
    }

    await new Promise<void>(resolve => {
      if(this._instance) {
        const { exitCode } = this._instance;
        if(typeof exitCode === 'number') {
          resolve();
        } else {
          this._instance.on('exit', () => {
            clearTimeout(timeout);
            setTimeout(() => {
              resolve();
            }, 1000);
          });
          this._instance.kill();
          const timeout = setTimeout(() => {
            this._docker.stop(this.id)
              .then(() => {
                setTimeout(() => {
                  resolve();
                }, 1000);
              })
              .catch(err => {
                this._logError(err);
                resolve();
              });
          }, 30000);
        }
      } else {
        resolve();
      }
    });
  }

  generateConfig(): string {
    return Ethereum.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

  async rpcGetVersion(): Promise<string> {
    try {
      this._runCheck('rpcGetVersion');
      const { body } = await request
        .post(this.endpoint())
        .set('Accept', 'application/json')
        .auth(this.rpcUsername, this.rpcPassword)
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '2.0',
          method: 'web3_clientVersion',
          params: [],
        });
      const { result = '' } = body;
      // first, check for RC matches
      let matches = result.match(/v(\d+\.\d+\.\d+-rc.+?)-/i);
      if(!matches)
        // check for regular matches
        matches = result.match(/v(\d+\.\d+\.\d+)/);
      if(matches && matches.length > 1) {
        return matches[1];
      } else {
        return '';
      }
    } catch(err) {
      this._logError(err);
      return '';
    }
  }

  async rpcGetBlockCount(): Promise<string> {
    let blockHeight;
    try {
      this._runCheck('rpcGetBlockCount');
      const res = await request
        .post(this.endpoint())
        .set('Accept', 'application/json')
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '2.0',
          method: 'eth_syncing',
          params: [],
        });
      if(res.body.result === false) {
        const res = await request
          .post(this.endpoint())
          .set('Accept', 'application/json')
          .timeout(this._requestTimeout)
          .send({
            id: '',
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
          });
        const currentBlock = res.body.result;
        const blockNum = parseInt(currentBlock, 16);
        blockHeight = blockNum > 0 ? blockNum.toString(10) : '';
      } else {
        const { currentBlock } = res.body.result;
        const blockNum = parseInt(currentBlock, 16);
        blockHeight = blockNum > 0 ? blockNum.toString(10) : '';
      }
    } catch(err) {
      this._logError(err);
      blockHeight = '';
    }
    return blockHeight || '';
  }

  _makeSyncingCall(): Promise<any> {
    return request
      .post(this.endpoint())
      .set('Accept', 'application/json')
      .timeout(this._requestTimeout)
      .send({
        id: '',
        jsonrpc: '2.0',
        method: 'eth_syncing',
        params: [],
      });
  }

  async getStatus(): Promise<string> {
    let status;
    try {
      if(this.remote) {
        const version = await this.rpcGetVersion();
        status = version ? Status.RUNNING : Status.STOPPED;
      } else {
        const stats = await this._docker.containerInspect(this.id);
        status = stats.State.Running ? Status.RUNNING : Status.STOPPED;
      }
    } catch(err) {
      status = Status.STOPPED;
    }

    if(status !== Status.STOPPED) {
      try {
        const res = await this._makeSyncingCall();
        if(res.body.result !== false)
          status = Status.SYNCING;
      } catch(err) {
        // do nothing with the error
      }
    }

    return status;
  }

}
