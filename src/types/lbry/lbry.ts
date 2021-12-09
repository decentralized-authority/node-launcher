import { Bitcoin } from '../bitcoin/bitcoin';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType } from '../../constants';
import { v4 as uuid } from 'uuid';
import { filterVersionsByNetworkType, generateRandom } from '../../util';
import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';

const coreConfig = `
server=1
listen=1
txindex=1
printtoconsole=1
[{{NETWORK}}]
datadir=/lbry/data
walletdir=/lbry/keys
rpcuser={{RPC_USERNAME}}
rpcpassword={{RPC_PASSWORD}}
rpcallowip=0.0.0.0/0
rpcbind=0.0.0.0
port={{PEER_PORT}}
rpcport={{RPC_PORT}}
`;

export class LBRY extends Bitcoin {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || LBRY.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '0.17.3.3',
            clientVersion: '0.17.3.3',
            image: 'rburgett/lbrycrd:v0.17.3.3',
            dataDir: '/lbry/data',
            walletDir: '/lbry/keys',
            configPath: '/lbry/lbrycrd.conf',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` -conf=${this.configPath}` + (data.network === NetworkType.TESTNET ? ' -testnet' : '');
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
    NodeClient.CORE,
  ];

  static nodeTypes = [
    NodeType.FULL,
  ];

  static networkTypes = [
    NetworkType.MAINNET,
    NetworkType.TESTNET,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 9245,
    [NetworkType.TESTNET]: 19245,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 9246,
    [NetworkType.TESTNET]: 19246,
  };

  static defaultCPUs = 4;

  static defaultMem = 8192;

  static generateConfig(client = LBRY.clients[0], network = NetworkType.MAINNET, peerPort = LBRY.defaultPeerPort[NetworkType.MAINNET], rpcPort = LBRY.defaultRPCPort[NetworkType.MAINNET], rpcUsername = generateRandom(), rpcPassword = generateRandom()): string {
    switch(client) {
      case NodeClient.CORE: {
        let config = coreConfig
          .replace('{{RPC_USERNAME}}', rpcUsername)
          .replace('{{RPC_PASSWORD}}', rpcPassword)
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .trim();
        if (network === NetworkType.MAINNET) {
          config = config
            .replace('[{{NETWORK}}]', '');
        } else {
          config = config
            .replace('{{NETWORK}}', 'lbrycrdtest');
        }
        return config;
      } default:
        return '';
    }
  }

  id: string;
  ticker = 'lbc';
  name = 'LBRY Coin';
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
  dockerCPUs = LBRY.defaultCPUs;
  dockerMem = LBRY.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configPath = '';

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || LBRY.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || LBRY.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || generateRandom();
    this.rpcPassword = data.rpcPassword || generateRandom();
    this.client = data.client || LBRY.clients[0];
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
    const versions = LBRY.versions(this.client, this.network);
    this.version = data.version || versions[0].version;
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    if(docker)
      this._docker = docker;
  }

  async start(): Promise<ChildProcess> {
    const versions = LBRY.versions(this.client, this.network);
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
    return LBRY.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort,
      this.rpcUsername,
      this.rpcPassword);
  }

}
