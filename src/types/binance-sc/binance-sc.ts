import { Ethereum } from '../ethereum/ethereum';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { v4 as uuid } from 'uuid';
import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import { filterVersionsByNetworkType } from '../../util';
import * as genesis from './genesis';
import { FS } from '../../util/fs';

const coreConfig = `
[Eth]
NetworkId = 56
NoPruning = false
SyncMode = "snap"
NoPrefetch = false
LightPeers = 100
UltraLightFraction = 75
TrieTimeout = 100000000000
EnablePreimageRecording = false
EWASMInterpreter = ""
EVMInterpreter = ""
TxLookupLimit = 0

[Eth.Miner]
GasFloor = 30000000
GasCeil = 40000000
GasPrice = 1000000000
Recommit = 10000000000
Noverify = false

[Eth.TxPool]
Locals = []
NoLocals = true
Journal = "transactions.rlp"
Rejournal = 3600000000000
PriceLimit = 1000000000
PriceBump = 10
AccountSlots = 512
GlobalSlots = 10000
AccountQueue = 256
GlobalQueue = 5000
Lifetime = 10800000000000

[Node]
DataDir = "/blockchain/data"
KeyStoreDir = "/blockchain/keys"
IPCPath = "geth.ipc"
HTTPHost = "0.0.0.0"
NoUSB = true
InsecureUnlockAllowed = false
HTTPPort = {{RPC_PORT}}
HTTPVirtualHosts = ["*"]
HTTPModules = ["eth", "net", "web3", "txpool", "parlia"]
WSModules = ["net", "web3", "eth"]

[Node.P2P]
MaxPeers = 20
NoDiscovery = false
BootstrapNodes = ["enode://1cc4534b14cfe351ab740a1418ab944a234ca2f702915eadb7e558a02010cb7c5a8c295a3b56bcefa7701c07752acd5539cb13df2aab8ae2d98934d712611443@52.71.43.172:30311","enode://28b1d16562dac280dacaaf45d54516b85bc6c994252a9825c5cc4e080d3e53446d05f63ba495ea7d44d6c316b54cd92b245c5c328c37da24605c4a93a0d099c4@34.246.65.14:30311","enode://5a7b996048d1b0a07683a949662c87c09b55247ce774aeee10bb886892e586e3c604564393292e38ef43c023ee9981e1f8b335766ec4f0f256e57f8640b079d5@35.73.137.11:30311"]
ListenAddr = ":{{PEER_PORT}}"
EnableMsgEvents = false

[Node.HTTPTimeouts]
ReadTimeout = 30000000000
WriteTimeout = 30000000000
IdleTimeout = 120000000000
`;

export class BinanceSC extends Ethereum {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || BinanceSC.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.GETH:
        versions = [
          {
            version: '1.1.8',
            clientVersion: '1.1.8',
            image: 'rburgett/bsc_geth:v1.1.8',
            dataDir: '/blockchain/data',
            walletDir: '/blockchain/keys',
            configDir: '/blockchain/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config=${path.join(this.configDir, BinanceSC.configName(data))}`;
            },
          },
          {
            version: '1.1.2',
            clientVersion: '1.1.2',
            image: 'rburgett/bsc_geth:v1.1.2',
            dataDir: '/blockchain/data',
            walletDir: '/blockchain/keys',
            configDir: '/blockchain/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config=${path.join(this.configDir, BinanceSC.configName(data))}`;
            },
          },
          {
            version: '1.1.0',
            clientVersion: '1.1.0',
            image: 'rburgett/bsc_geth:v1.1.0-beta',
            dataDir: '/blockchain/data',
            walletDir: '/blockchain/keys',
            configDir: '/blockchain/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config=${path.join(this.configDir, BinanceSC.configName(data))}`;
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
    NodeType.ARCHIVAL,
  ];

  static networkTypes = [
    NetworkType.MAINNET,
  ];

  static roles = [
    Role.NODE,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 8545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8546,
  };

  static defaultCPUs = 8;

  static defaultMem = 32768;

  static generateConfig(client = BinanceSC.clients[0], network = NetworkType.MAINNET, peerPort = BinanceSC.defaultPeerPort[NetworkType.MAINNET], rpcPort = BinanceSC.defaultRPCPort[NetworkType.MAINNET]): string {
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

  static getGenesis(network: string): string {
    switch(network) {
      case NetworkType.MAINNET: {
        return genesis.mainnet;
      } default:
        return '';
    }
  }

  static configName(data: CryptoNodeData): string {
    return 'config.toml';
  }

  id: string;
  ticker = 'bsc';
  name = 'Binance Smart Chain';
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
  dockerCPUs = BinanceSC.defaultCPUs;
  dockerMem = BinanceSC.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || BinanceSC.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || BinanceSC.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || BinanceSC.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configDir = data.configDir || this.configDir;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = BinanceSC.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  async start(): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = BinanceSC.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);

    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);

    if(!running) {
      const {
        dataDir: containerDataDir,
        walletDir: containerWalletDir,
        configDir: containerConfigDir,
      } = versionData;
      let args = [
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

      const configDir = this.configDir || path.join(tmpdir, uuid());
      await fs.ensureDir(configDir);
      const configPath = path.join(configDir, BinanceSC.configName(this));
      const configExists = await fs.pathExists(configPath);
      if (!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');
      args = [...args, '-v', `${configDir}:${containerConfigDir}`];

      const genesisPath = path.join(dataDir, 'genesis.json');
      const genesisExists = await fs.pathExists(genesisPath);

      if (!genesisExists) {
        const genesis = BinanceSC.getGenesis(this.network);
        await fs.writeFile(genesisPath, genesis, 'utf8');
        await new Promise<void>((resolve, reject) => {
          this._docker.run(
            this.dockerImage + versionData.generateRuntimeArgs(this) + ` init ${path.join(containerDataDir, 'genesis.json')}`,
            [...args, '-i', '--rm'],
            output => this._logOutput(output),
            err => {
              this._logError(err);
              resolve();
            },
            () => {
              resolve();
            },
          );
        });
      }

      args = [
        ...args,
        '-d',
        `--restart=on-failure:${this.restartAttempts}`,
      ];

      await this._docker.createNetwork(this.dockerNetwork);
      const exitCode = await new Promise<number>((resolve, reject) => {
        this._docker.run(
          this.dockerImage + versionData.generateRuntimeArgs(this),
          args,
          output => this._logOutput(output),
          err => {
            this._logError(err);
            reject(err);
          },
          code => {
            resolve(code);
          },
        );
      });
      if(exitCode !== 0)
        throw new Error(`Docker run for ${this.id} with ${this.dockerImage} failed with exit code ${exitCode}`);
    }

    const instance = this._docker.attach(
      this.id,
      output => this._logOutput(output),
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );

    this._instance = instance;
    this._instances = [
      instance,
    ];
    return this.instances();
  }

  generateConfig(): string {
    return BinanceSC.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

}
