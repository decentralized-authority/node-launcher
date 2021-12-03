import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType } from '../../constants';
import { Bitcoin } from '../bitcoin/bitcoin';
import { Docker } from '../../util/docker';
import { v4 as uuid } from 'uuid';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { PocketGenesis } from './genesis';
import request from 'superagent';
import { filterVersionsByNetworkType } from '../../util';

const coreConfig = `
{
    "tendermint_config": {
        "RootDir": "/root/.pocket",
        "ProxyApp": "tcp://127.0.0.1:26658",
        "Moniker": "af05d07b101d",
        "FastSyncMode": true,
        "DBBackend": "goleveldb",
        "LevelDBOptions": {
            "block_cache_capacity": 83886,
            "block_cache_evict_removed": false,
            "block_size": 4096,
            "disable_buffer_pool": true,
            "open_files_cache_capacity": -1,
            "write_buffer": 838860
        },
        "DBPath": "data",
        "LogLevel": "*:error",
        "LogFormat": "plain",
        "Genesis": "config/genesis.json",
        "PrivValidatorKey": "priv_val_key.json",
        "PrivValidatorState": "priv_val_state.json",
        "PrivValidatorListenAddr": "",
        "NodeKey": "node_key.json",
        "ABCI": "socket",
        "ProfListenAddress": "",
        "FilterPeers": false,
        "RPC": {
            "RootDir": "/root/.pocket",
            "ListenAddress": "tcp://127.0.0.1:26657",
            "CORSAllowedOrigins": [],
            "CORSAllowedMethods": [
                "HEAD",
                "GET",
                "POST"
            ],
            "CORSAllowedHeaders": [
                "Origin",
                "Accept",
                "Content-Type",
                "X-Requested-With",
                "X-Server-Time"
            ],
            "GRPCListenAddress": "",
            "GRPCMaxOpenConnections": 2500,
            "Unsafe": false,
            "MaxOpenConnections": 2500,
            "MaxSubscriptionClients": 100,
            "MaxSubscriptionsPerClient": 5,
            "TimeoutBroadcastTxCommit": 10000000000,
            "MaxBodyBytes": 1000000,
            "MaxHeaderBytes": 1048576,
            "TLSCertFile": "",
            "TLSKeyFile": ""
        },
        "P2P": {
            "RootDir": "/root/.pocket",
            "ListenAddress": "tcp://0.0.0.0:26656",
            "ExternalAddress": "",
            "Seeds": "",
            "PersistentPeers": "",
            "UPNP": false,
            "AddrBook": "config/addrbook.json",
            "AddrBookStrict": false,
            "MaxNumInboundPeers": 21,
            "MaxNumOutboundPeers": 7,
            "UnconditionalPeerIDs": "",
            "PersistentPeersMaxDialPeriod": 0,
            "FlushThrottleTimeout": 100000000,
            "MaxPacketMsgPayloadSize": 1024,
            "SendRate": 5120000,
            "RecvRate": 5120000,
            "PexReactor": true,
            "SeedMode": false,
            "PrivatePeerIDs": "",
            "AllowDuplicateIP": true,
            "HandshakeTimeout": 20000000000,
            "DialTimeout": 3000000000,
            "TestDialFail": false,
            "TestFuzz": false,
            "TestFuzzConfig": {
                "Mode": 0,
                "MaxDelay": 3000000000,
                "ProbDropRW": 0.2,
                "ProbDropConn": 0,
                "ProbSleep": 0
            }
        },
        "Mempool": {
            "RootDir": "/root/.pocket",
            "Recheck": true,
            "Broadcast": true,
            "WalPath": "",
            "Size": 9000,
            "MaxTxsBytes": 1073741824,
            "CacheSize": 9000,
            "MaxTxBytes": 1048576
        },
        "FastSync": {
            "Version": "v1"
        },
        "Consensus": {
            "RootDir": "/root/.pocket",
            "WalPath": "data/cs.wal/wal",
            "TimeoutPropose": 120000000000,
            "TimeoutProposeDelta": 10000000000,
            "TimeoutPrevote": 60000000000,
            "TimeoutPrevoteDelta": 10000000000,
            "TimeoutPrecommit": 60000000000,
            "TimeoutPrecommitDelta": 10000000000,
            "TimeoutCommit": 780000000000,
            "SkipTimeoutCommit": false,
            "CreateEmptyBlocks": true,
            "CreateEmptyBlocksInterval": 900000000000,
            "PeerGossipSleepDuration": 30000000000,
            "PeerQueryMaj23SleepDuration": 20000000000
        },
        "TxIndex": {
            "Indexer": "kv",
            "IndexKeys": "tx.hash,tx.height,message.sender,transfer.recipient",
            "IndexAllKeys": false
        },
        "Instrumentation": {
            "Prometheus": false,
            "PrometheusListenAddr": ":26660",
            "MaxOpenConnections": 3,
            "Namespace": "tendermint"
        }
    },
    "pocket_config": {
        "data_dir": "/root/.pocket",
        "genesis_file": "genesis.json",
        "chains_name": "chains.json",
        "session_db_name": "session",
        "evidence_db_name": "pocket_evidence",
        "tendermint_uri": "tcp://localhost:26657",
        "keybase_name": "../pocket-keys/pocket-keybase",
        "rpc_port": "8081",
        "client_block_sync_allowance": 10,
        "max_evidence_cache_entries": 500,
        "max_session_cache_entries": 500,
        "json_sort_relay_responses": true,
        "remote_cli_url": "http://localhost:8081",
        "user_agent": "",
        "validator_cache_size": 100,
        "application_cache_size": 100,
        "rpc_timeout": 3000,
        "pocket_prometheus_port": "8083",
        "prometheus_max_open_files": 3,
        "max_claim_age_for_proof_retry": 32,
        "proof_prevalidation": false,
        "ctx_cache_size": 20,
        "abci_logging": false,
        "show_relay_errors": true,
        "disable_tx_events": true
    }
}
`;

export class Pocket extends Bitcoin {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Pocket.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: 'RC-0.6.4.1',
            clientVersion: 'RC-0.6.4.1',
            image: 'rburgett/pocketcore:RC-0.6.4.1',
            dataDir: '/root/.pocket',
            walletDir: '/root/pocket-keys',
            configPath: '',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()} --useCache`;
            },
          },
          {
            version: 'RC-0.6.4',
            clientVersion: 'RC-0.6.4',
            image: 'rburgett/pocketcore:RC-0.6.4',
            dataDir: '/root/.pocket',
            walletDir: '/root/pocket-keys',
            configPath: '',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()} --useCache`;
            },
          },
          {
            version: 'RC-0.6.3.7',
            clientVersion: 'RC-0.6.3.7',
            image: 'rburgett/pocketcore:RC-0.6.3.7',
            dataDir: '/root/.pocket',
            walletDir: '/root/pocket-keys',
            configPath: '',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          {
            version: 'RC-0.6.3.6',
            clientVersion: 'RC-0.6.3.6',
            image: 'rburgett/pocketcore:RC-0.6.3.6',
            dataDir: '/root/.pocket',
            walletDir: '/root/pocket-keys',
            configPath: '',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
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
    [NetworkType.MAINNET]: 8081,
    [NetworkType.TESTNET]: 8081,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 26656,
    [NetworkType.TESTNET]: 26656,
  };

  static defaultSeeds = {
    [NetworkType.MAINNET]: '03b74fa3c68356bb40d58ecc10129479b159a145@seed1.mainnet.pokt.network:20656,64c91701ea98440bc3674fdb9a99311461cdfd6f@seed2.mainnet.pokt.network:21656,0057ee693f3ce332c4ffcb499ede024c586ae37b@seed3.mainnet.pokt.network:22856,9fd99b89947c6af57cd0269ad01ecb99960177cd@seed4.mainnet.pokt.network:23856,f2a4d0ec9d50ea61db18452d191687c899c3ca42@seed5.mainnet.pokt.network:24856,f2a9705924e8d0e11fed60484da2c3d22f7daba8@seed6.mainnet.pokt.network:25856,582177fd65dd03806eeaa2e21c9049e653672c7e@seed7.mainnet.pokt.network:26856,2ea0b13ab823986cfb44292add51ce8677b899ad@seed8.mainnet.pokt.network:27856,a5f4a4cd88db9fd5def1574a0bffef3c6f354a76@seed9.mainnet.pokt.network:28856,d4039bd71d48def9f9f61f670c098b8956e52a08@seed10.mainnet.pokt.network:29856,18eaabef85c661344b640b74597c4973af707ccb@pocket-seed.simply-vc.com.mt:26656,5c133f07ed296bb9e21e3e42d5f26e0f7d2b2832@poktseed100.chainflow.io:26656,361b1936d3fbe516628ebd6a503920fc4fc0f6a7@seed.pokt.rivet.cloud:26656',
    [NetworkType.TESTNET]: 'b3d86cd8ab4aa0cb9861cb795d8d154e685a94cf@seed1.testnet.pokt.network:20656,17ca63e4ff7535a40512c550dd0267e519cafc1a@seed2.testnet.pokt.network:21656,f99386c6d7cd42a486c63ccd80f5fbea68759cd7@seed3.testnet.pokt.network:22656',
  };

  static defaultCPUs = 4;

  static defaultMem = 8192;

  static generateConfig(client = Pocket.clients[0], network = NetworkType.MAINNET, peerPort = Pocket.defaultPeerPort[NetworkType.MAINNET], rpcPort = Pocket.defaultRPCPort[NetworkType.MAINNET], domain = ''): string {
    switch(client) {
      case NodeClient.CORE: {
        const config = JSON.parse(coreConfig);
        config.pocket_config.rpc_port = rpcPort.toString(10);
        config.pocket_config.remote_cli_url = `http://localhost:${rpcPort}`;
        config.tendermint_config.P2P.Seeds = Pocket.defaultSeeds[network];
        config.tendermint_config.P2P.ListenAddress = `tcp://0.0.0.0:${peerPort}`;
        if(domain) {
          config.tendermint_config.P2P.ExternalAddress = `tcp://${domain}:${peerPort}`;
        }
        return JSON.stringify(config, null, '    ');
      } default:
        return '';
    }
  }

  id: string;
  ticker = 'pokt';
  name = 'Pocket';
  version: string;
  clientVersion: string;
  archival = false;
  dockerImage: string;
  network: string;
  peerPort: number;
  privKeyPass = '';
  rpcPort: number;
  rpcUsername: string;
  rpcPassword: string;
  client: string;
  dockerCPUs = Pocket.defaultCPUs;
  dockerMem = Pocket.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configPath = '';
  domain = '';
  address = '';

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Pocket.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Pocket.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';

    this.client = data.client || Pocket.clients[0];
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
    const versions = Pocket.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    this.clientVersion = data.clientVersion || (versions && versions[0] ? versions[0].clientVersion : '');
    this.archival = data.archival || this.archival;
    this.dockerImage = data.dockerImage || (versions && versions[0] ? versions[0].image : '');
    this.domain = data.domain || this.domain;
    this.address = data.address || this.address;

    this.privKeyPass = data.privKeyPass || uuid();

    if(docker)
      this._docker = docker;
  }

  async start(): Promise<ChildProcess> {
    const versions = Pocket.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
    } = versionData;

    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    await fs.ensureDir(dataDir);

    const walletDir = this.walletDir || path.join(tmpdir, uuid());
    await fs.ensureDir(walletDir);

    const configPath = this.configPath || path.join(tmpdir, uuid());
    const configExists = await fs.pathExists(configPath);
    if(!configExists)
      await fs.writeFile(configPath, this.generateConfig(), 'utf8');

    const configDir = path.join(dataDir, 'config');
    await fs.ensureDir(configDir);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await fs.copy(configPath, path.join(configDir, 'config.json'), {force: true});

    const genesisPath = path.join(configDir, 'genesis.json');
    const genesisExists = await fs.pathExists(genesisPath);
    if(!genesisExists)
      await fs.writeFile(genesisPath, PocketGenesis[this.network].trim(), 'utf8');

    const keybaseExists = await fs.pathExists(path.join(walletDir, 'pocket-keybase.db'));
    if(!keybaseExists) {
      const args = [
        '-i',
        '--rm',
        '-v', `${dataDir}:${containerDataDir}`,
        '-v', `${walletDir}:${containerWalletDir}`,
        '--entrypoint', 'pocket',
      ];
      await new Promise<void>((resolve, reject) => {
        this._docker.run(
          this.dockerImage + ` accounts create --pwd ${this.privKeyPass}`,
          args,
          output => this._logOutput(output),
          err => {
            reject(err);
          },
          () => {
            resolve();
          }
        );
      });
    }

    await this._docker.createNetwork(this.dockerNetwork);

    const args = [
      '-i',
      '--rm',
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
      '-p', `${this.peerPort}:${this.peerPort}`,
      '-v', `${dataDir}:${containerDataDir}`,
      '-v', `${walletDir}:${containerWalletDir}`,
      '--entrypoint', 'pocket',
    ];
    this._instance = this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      args,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );
    return this._instance;
  }

  generateConfig(): string {
    return Pocket.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort,
      this.domain);
  }

  async rpcGetVersion(): Promise<string> {
    try {
      this._runCheck('rpcGetVersion');
      const { body: version = '' } = await request
        .get(`${this.endpoint()}/v1`)
        .timeout(this._requestTimeout);
      return version;
    } catch(err) {
      this._logError(err);
      return '';
    }
  }

  async rpcGetBlockCount(): Promise<string> {
    try {
      this._runCheck('rpcGetBlockCount');
      const { body = {} } = await request
        .post(`${this.endpoint()}/v1/query/height`)
        .timeout(this._requestTimeout)
        .set('Accept', 'application/json');
      return String(body.height) || '0';
    } catch(err) {
      this._logError(err);
      return '0';
    }
  }

}
