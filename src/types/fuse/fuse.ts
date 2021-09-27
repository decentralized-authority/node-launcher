import { Ethereum } from '../ethereum/ethereum';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType } from '../../constants';
import { v4 as uuid } from 'uuid';
import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';

const coreConfig = `
[parity]
chain = "/home/parity/.local/share/io.parity.ethereum/spec.json"
db_path = "/root/data"
keys_path = "/root/keystore"

[rpc]
cors = ["all"]
port = {{RPC_PORT}}
interface = "all"
hosts = ["all"]
apis = ["web3", "eth", "net", "parity", "traces", "rpc", "secretstore"]

[websockets]
disable = true

[network]
port = {{PEER_PORT}}
reserved_peers="/home/parity/.local/share/io.parity.ethereum/bootnodes.txt"
`;

export class Fuse extends Ethereum {

  static versions(client = Fuse.clients[0]): VersionDockerImage[] {
    client = client || Fuse.clients[0];
    switch(client) {
      case NodeClient.PARITY:
        return [
          {
            version: '2.5.13',
            image: 'fusenet/node:1.0.0',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config=${this.configPath}`;
            },
          },
        ];
      default:
        return [];
    }
  }

  static clients = [
    NodeClient.PARITY,
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
    [NetworkType.MAINNET]: 30300,
  };

  static generateConfig(client = Fuse.clients[0], network = NetworkType.MAINNET, peerPort = Fuse.defaultPeerPort[NetworkType.MAINNET], rpcPort = Fuse.defaultRPCPort[NetworkType.MAINNET]): string {
    switch(client) {
      case NodeClient.PARITY:
        return coreConfig
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace(/{{RPC_PORT}}/g, rpcPort.toString(10))
          .trim();
      default:
        return '';
    }
  }

  id: string;
  ticker = 'fuse';
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

  constructor(data: CryptoNodeData, docker?: Docker, logInfo?: (message: string)=>void, logError?: (message: string)=>void) {
    super(data, docker, logInfo, logError);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Fuse.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Fuse.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Fuse.clients[0];
    this.dockerCpus = data.dockerCpus || this.dockerCpus;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configPath = data.configPath || this.configPath;
    const versions = Fuse.versions(this.client);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    this.dockerImage = data.dockerImage || (versions && versions[0] ? versions[0].image : '');
    if(docker)
      this._docker = docker;
    if(logError)
      this._logError = logError;
    if(logInfo)
      this._logInfo = logInfo;
  }

  async start(onOutput?: (output: string)=>void, onError?: (err: Error)=>void): Promise<ChildProcess> {
    const versionData = Fuse.versions(this.client).find(({ version }) => version === this.version);
    if(!versionData)
      throw new Error(`Unknown ${this.ticker} version ${this.version}`);
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
      '--entrypoint', '/usr/local/bin/parity',
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
      onOutput ? onOutput : ()=>{},
      // console.log,
      onError ? onError : ()=>{},
      // console.error,
    );
    this._instance = instance;
    return instance;
  }

  generateConfig(): string {
    return Fuse.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

}
