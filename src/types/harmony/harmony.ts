import { Ethereum } from '../ethereum/ethereum';
import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { Docker } from '../../util/docker';
import { v4 as uuid } from 'uuid';
import { filterVersionsByNetworkType } from '../../util';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import request from 'superagent';
import { FS } from '../../util/fs';

const coreConfig = `
Version = "2.5.0"

[BLSKeys]
  KMSConfigFile = ""
  KMSConfigSrcType = "shared"
  KMSEnabled = false
  KeyDir = "./.hmy/blskeys"
  KeyFiles = []
  MaxKeys = 10
  PassEnabled = true
  PassFile = ""
  PassSrcType = "auto"
  SavePassphrase = false

[DNSSync]
  Client = true
  LegacySyncing = false
  Port = 6000
  Server = true
  ServerPort = 6000
  Zone = "t.hmny.io"

[General]
  DataDir = "/root/data"
  IsArchival = false
  IsBeaconArchival = false
  IsOffline = false
  NoStaking = true
  NodeType = "explorer"
  ShardID = {{SHARD}}

[HTTP]
  Enabled = true
  IP = "0.0.0.0"
  Port = {{RPC_PORT}}
  RosettaEnabled = false
  RosettaPort = 9700

[Log]
  FileName = "harmony.log"
  Folder = "./latest"
  RotateCount = 0
  RotateMaxAge = 0
  RotateSize = 100
  Verbosity = 3

  [Log.VerbosePrints]
    Config = false

[Network]
  BootNodes = ["/dnsaddr/bootstrap.t.hmny.io"]
  NetworkType = "mainnet"

[P2P]
  IP = "0.0.0.0"
  KeyFile = "./.hmykey"
  Port = {{PEER_PORT}}

[Pprof]
  Enabled = false
  ListenAddr = "127.0.0.1:6060"

[RPCOpt]
  DebugEnabled = false
  RateLimterEnabled = true
  RequestsPerSecond = 1000

[Sync]
  Concurrency = 6
  DiscBatch = 8
  DiscHardLowCap = 6
  DiscHighCap = 128
  DiscSoftLowCap = 8
  Downloader = false
  Enabled = false
  InitStreams = 8
  MinPeers = 6

[TxPool]
  BlacklistFile = "./.hmy/blacklist.txt"

[WS]
  Enabled = true
  IP = "127.0.0.1"
  Port = 9800
`;

interface HarmonyNodeData extends CryptoNodeData {
  shard: number
}

export class Harmony extends Ethereum {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Harmony.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '4.3.9',
            clientVersion: '4.3.9',
            image: 'rburgett/harmony:4.3.9',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName(data))}`;
            },
          },
          {
            version: '4.3.8',
            clientVersion: '4.3.8',
            image: 'rburgett/harmony:4.3.8',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName(data))}`;
            },
          },
          {
            version: '4.3.4',
            clientVersion: '4.3.4',
            image: 'rburgett/harmony:4.3.4',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName(data))}`;
            },
          },
          {
            version: '4.3.2',
            clientVersion: '4.3.2',
            image: 'pocketfoundation/harmony:4.3.2-29-g1c450bbc',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName(data))}`;
            },
          },
          {
            version: '4.3.1',
            clientVersion: '4.3.1',
            image: 'pocketfoundation/harmony:4.3.1',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName(data))}`;
            },
          },
          {
            version: '4.3.0',
            clientVersion: '4.3.0',
            image: 'pocketfoundation/harmony:4.3.0',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName(data))}`;
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
  ];

  static roles = [
    Role.NODE,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 9500,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 9000,
  };

  static defaultCPUs = 8;

  static defaultMem = 32768;

  static generateConfig(client = Harmony.clients[0], network = NetworkType.MAINNET, peerPort = Harmony.defaultPeerPort[NetworkType.MAINNET], rpcPort = Harmony.defaultRPCPort[NetworkType.MAINNET], shard = 0): string {
    switch(client) {
      case NodeClient.CORE:
        return coreConfig
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .replace('{{SHARD}}', shard.toString(10))
          .trim();
      default:
        return '';
    }
  }

  static configName(data: CryptoNodeData): string {
    return 'harmony.conf';
  }

  id: string;
  ticker = 'one';
  name = 'Harmony One';
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
  dockerCPUs = Harmony.defaultCPUs;
  dockerMem = Harmony.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  shard = 0;
  role = Harmony.roles[0];

  constructor(data: HarmonyNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Harmony.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Harmony.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Harmony.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.walletDir;
    this.configDir = data.configDir || this.configDir;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Harmony.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.shard = data.shard || this.shard;
    this.role = data.role || this.role;
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  async start(): Promise<ChildProcess[]> {
    const fs = this._fs;
    // const versionData = Harmony.versions(this.client, this.network).find(({ version }) => version === this.version);
    const versions = Harmony.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configDir: containerConfigDir,
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

    const configDir = this.configDir || path.join(tmpdir, uuid());
    await fs.ensureDir(configDir);
    const configPath = path.join(configDir, Harmony.configName(this));
    const configExists = await fs.pathExists(configPath);
    if(!configExists)
      await fs.writeFile(configPath, this.generateConfig(), 'utf8');
    args = [...args, '-v', `${configDir}:${containerConfigDir}`];

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
    this._instances = [
      instance,
    ];
    return this.instances();
  }

  toObject(): HarmonyNodeData {
    return {
      ...this._toObject(),
      shard: this.shard,
    };
  }

  generateConfig(): string {
    return Harmony.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort,
      this.shard);
  }

  _makeSyncingCall(): Promise<any> {
    return request
      .post(this.endpoint())
      .set('Accept', 'application/json')
      .timeout(this._requestTimeout)
      .send({
        id: '',
        jsonrpc: '2.0',
        method: 'hmy_syncing',
        params: [],
      });
  }

}
