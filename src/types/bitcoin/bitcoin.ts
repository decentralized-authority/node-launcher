import { CryptoNode, CryptoNodeData, CryptoNodeStatic, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType } from '../../constants';
import { generateRandom } from '../../util';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';

const coreConfig = `
server=1
listen=1
txindex=1
datadir=/opt/blockchain/data
walletdir=/opt/blockchain/wallets
[{{NETWORK}}]
rpcuser={{RPC_USERNAME}}
rpcpassword={{RPC_PASSWORD}}
rpcallowip=0.0.0.0/0
rpcbind=0.0.0.0
port={{PEER_PORT}}
rpcport={{RPC_PORT}}
`;

export class Bitcoin implements CryptoNodeData, CryptoNode, CryptoNodeStatic {

  static versions(client: string): VersionDockerImage[] {
    client = client || Bitcoin.clients[0];
    switch(client) {
      case NodeClient.CORE:
        return [
          {
            version: '0.21.0',
            image: 'rburgett/bitcoin:v0.21.0',
            dataDir: '/opt/blockchain/data',
            walletDir: '/opt/blockchain/wallets',
            configPath: '/opt/blockchain/bitcoin.conf',
            generateRuntimeArgs(data: CryptoNodeData): string {
              return `bitcoind -conf=${this.configPath}` + (data.network === NetworkType.TESTNET ? ' -testnet' : '');
            },
          },
        ];
      default:
        return [];
    }
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
    [NetworkType.MAINNET]: 8332,
    [NetworkType.TESTNET]: 18332,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8333,
    [NetworkType.TESTNET]: 18333,
  };

  static defaultCPUs = 4;

  static defaultMem = 4096;

  static generateConfig(client = Bitcoin.clients[0], network = NetworkType.MAINNET, peerPort = Bitcoin.defaultPeerPort[NetworkType.MAINNET], rpcPort = Bitcoin.defaultRPCPort[NetworkType.MAINNET], rpcUsername = generateRandom(), rpcPassword = generateRandom()): string {
    switch(client) {
      case NodeClient.CORE:
        return coreConfig
          .replace('{{NETWORK}}', network === NetworkType.MAINNET ? 'main' : 'test')
          .replace('{{RPC_USERNAME}}', rpcUsername)
          .replace('{{RPC_PASSWORD}}', rpcPassword)
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .trim();
      default:
        return '';
    }
  }

  id: string;
  ticker = 'btc';
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

  _docker = new Docker({});
  _instance?: ChildProcess;

  constructor(data: CryptoNodeData, docker?: Docker) {
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Bitcoin.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Bitcoin.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || generateRandom();
    this.rpcPassword = data.rpcPassword || generateRandom();
    this.client = data.client || Bitcoin.clients[0];
    this.dockerCpus = data.dockerCpus || this.dockerCpus;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configPath = data.configPath || this.configPath;
    this._docker = docker || this._docker;
    this.version = data.version || Bitcoin.versions(this.client)[0].version;
    this.dockerImage = data.dockerImage || Bitcoin.versions(this.client)[0].image;
  }

  async start(): Promise<ChildProcess> {
    const versionData = Bitcoin.versions(this.client).find(({ version }) => version === this.version);
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
    if(this.dataDir)
      args = [...args, '-v', `${this.dataDir}:${containerDataDir}`];
    if(this.walletDir)
      args = [...args, '-v', `${this.walletDir}:${containerWalletDir}`];
    if(this.configPath)
      args = [...args, '-v', `${this.configPath}:${containerConfigPath}`];
    await this._docker.createNetwork(this.dockerNetwork);
    const instance = this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      args,
      console.log,
      console.error,
    );
    this._instance = instance;
    return instance;
  }

  stop():Promise<void> {
    return new Promise<void>(resolve => {
      if(this._instance) {
        this._instance.on('exit', () => {
          clearTimeout(timeout);
          resolve();
        });
        this._instance.kill();
        const timeout = setTimeout(() => {
          this._docker.kill(this.id)
            .then(() => resolve())
            .catch(() => resolve());
        }, 30000);
      } else {
        resolve();
      }
    });
  }

  toObject(): CryptoNodeData {
    return {
      id: this.id,
      ticker: this.ticker,
      version: this.version,
      dockerImage: this.dockerImage,
      peerPort: this.peerPort,
      rpcPort: this.rpcPort,
      rpcUsername: this.rpcUsername,
      rpcPassword: this.rpcPassword,
      client: this.client,
      network: this.network,
      dockerCpus: this.dockerCpus,
      dockerMem: this.dockerMem,
      dockerNetwork: this.dockerNetwork,
      dataDir: this.dataDir,
      walletDir: this.walletDir,
      configPath: this.configPath,
    };
  }

  generateConfig(): string {
    return Bitcoin.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort,
      this.rpcUsername,
      this.rpcPassword);
  }

}
