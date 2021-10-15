import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType } from '../../constants';
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
SyncMode = "fast"

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

export class Ethereum extends Bitcoin {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Ethereum.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.GETH:
        versions = [
          {
            version: '1.10.3',
            clientVersion: '1.10.3',
            image: 'ethereum/client-go:v1.10.3',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
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

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 8545,
    [NetworkType.RINKEBY]: 18545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8546,
    [NetworkType.RINKEBY]: 18546,
  };

  static defaultCPUs = 4;

  static defaultMem = 4096;

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
  dockerImage: string;
  network: string;
  peerPort: number;
  rpcPort: number;
  rpcUsername: string;
  rpcPassword: string;
  client: string;
  dockerCpus = 4;
  dockerMem = 4096;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configPath = '';

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Ethereum.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Ethereum.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Ethereum.clients[0];
    this.dockerCpus = data.dockerCpus || this.dockerCpus;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configPath = data.configPath || this.configPath;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    const versions = Ethereum.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    this.dockerImage = data.dockerImage || (versions && versions[0] ? versions[0].image : '');
    if(docker)
      this._docker = docker;
  }

  async start(): Promise<ChildProcess> {
    const versionData = Ethereum.versions(this.client, this.network).find(({ version }) => version === this.version);
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configPath: containerConfigPath,
    } = versionData;
    let args = [
      '-i',
      '--rm',
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCpus.toString(10),
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

  generateConfig(): string {
    return Ethereum.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

  async rpcGetVersion(): Promise<string> {
    if(!this._instance)
      throw new Error('Instance must be running before you can call rpcGetVersion()');
    try {
      const { body } = await request
        .post(`http://localhost:${this.rpcPort}/`)
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
      const matches = result.match(/v(\d+\.\d+\.\d+)/);
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
    try {
      const res = await request
        .post(`http://localhost:${this.rpcPort}/`)
        .set('Accept', 'application/json')
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '2.0',
          method: 'eth_syncing',
          params: [],
        });
      if(res.body.result === false) {
        return '0';
      } else {
        const { currentBlock } = res.body.result;
        const blockNum = parseInt(currentBlock, 16);
        return blockNum > 0 ? String(blockNum) : '0';
      }
    } catch(err) {
      this._logError(err);
      return '0';
    }
  }

}
