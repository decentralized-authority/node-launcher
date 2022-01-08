import { Ethereum } from '../ethereum/ethereum';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType } from '../../constants';
import { v4 as uuid } from 'uuid';
import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { filterVersionsByNetworkType } from '../../util';
import { openEthereumConfig } from './openethereum/config';
import { nethermindConfig } from './nethermind/config';



export class Xdai extends Ethereum {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Xdai.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.OPEN_ETHEREUM:
        versions = [
          {
            version: '3.3.0-rc.15',
            clientVersion: '3.3.0-rc.15',
            image: 'rburgett/openethereum:v3.3.0-rc.15',
            dataDir: '/blockchain/data',
            walletDir: '/blockchain/keys',
            configPath: '/blockchain/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config=${this.configPath}`;
            },
          },
          {
            version: '3.2.6',
            clientVersion: '3.2.6',
            image: 'rburgett/openethereum:v3.2.6',
            dataDir: '/blockchain/data',
            walletDir: '/blockchain/keys',
            configPath: '/blockchain/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config=${this.configPath}`;
            },
          },
        ];
        break;
      case NodeClient.NETHERMIND:
        versions = [
          {
            version: '1.12.3',
            clientVersion: '1.12.3',
            image: 'nethermind/nethermind:1.12.3',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configPath: '/nethermind/configs/xdai.cfg',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config xdai`;
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
    NodeClient.OPEN_ETHEREUM,
    NodeClient.NETHERMIND,
  ];

  static nodeTypes = [
    NodeType.FULL,
  ];

  static networkTypes = [
    NetworkType.MAINNET,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 8545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 30303,
  };

  static defaultCPUs = 6;

  static defaultMem = 8192;

  static generateConfig(client = Xdai.clients[0], network = NetworkType.MAINNET, peerPort = Xdai.defaultPeerPort[NetworkType.MAINNET], rpcPort = Xdai.defaultRPCPort[NetworkType.MAINNET]): string {
    let cfg;
    switch(client) {
      case NodeClient.OPEN_ETHEREUM:
        return openEthereumConfig
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .trim();
      case NodeClient.NETHERMIND:
        cfg = nethermindConfig;
        cfg.JsonRpc.Port = rpcPort;
        cfg.Network.DiscoveryPort = peerPort;
        cfg.Network.P2PPort = peerPort;
        return JSON.stringify(cfg);
      default:
        return '';
    }
  }

  id: string;
  ticker = 'xdai';
  name = 'xDAI';
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
  dockerCPUs = Xdai.defaultCPUs;
  dockerMem = Xdai.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configPath = '';

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Xdai.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Xdai.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Xdai.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configPath = data.configPath || this.configPath;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Xdai.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    if(docker)
      this._docker = docker;
  }

  async start(): Promise<ChildProcess> {
    const versions = Xdai.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
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

  generateConfig(): string {
    return Xdai.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

}
