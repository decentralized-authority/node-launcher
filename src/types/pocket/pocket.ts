import { CryptoNodeData, ValidatorInfo, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { Bitcoin } from '../bitcoin/bitcoin';
import { Docker } from '../../util/docker';
import { v4 as uuid } from 'uuid';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import { PocketGenesis } from './genesis';
import request from 'superagent';
import { filterVersionsByNetworkType, getSecretsDir } from '../../util';
import { FS } from '../../util/fs';
import { CoinDenom, Configuration, HttpRpcProvider, Pocket as PocketJS } from '@pokt-network/pocket-js';
import { isError } from 'lodash';
import * as math from 'mathjs';

interface PocketValidatorInfo extends ValidatorInfo {
  chains: string[];
}

interface PocketNodeData extends CryptoNodeData {
  publicKey: string
  privateKeyEncrypted: string
  address: string
  domain: string
}

const coreConfig = `
{
    "tendermint_config": {
        "RootDir": "/root/.pocket",
        "ProxyApp": "tcp://127.0.0.1:26658",
        "Moniker": "fdd1670a4962",
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
        "DBPath": "../pocket-data/data",
        "LogLevel": "*:error",
        "LogFormat": "plain",
        "Genesis": "config/genesis.json",
        "PrivValidatorKey": "../../run/secrets/priv_val_key.json",
        "PrivValidatorState": "../pocket-keys/priv_val_state.json",
        "PrivValidatorListenAddr": "",
        "NodeKey": "../../run/secrets/node_key.json",
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
            "MaxNumInboundPeers": 14,
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
            "Size": 18000,
            "MaxTxsBytes": 2147483648,
            "CacheSize": 18000,
            "MaxTxBytes": 2097152
        },
        "FastSync": {
            "Version": "v1"
        },
        "Consensus": {
            "RootDir": "/root/.pocket",
            "WalPath": "../pocket-data/data/cs.wal/wal",
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
        "evidence_db_name": "../pocket-data/pocket_evidence",
        "tendermint_uri": "tcp://localhost:26657",
        "keybase_name": "../pocket-keys/pocket-keybase",
        "rpc_port": "8081",
        "client_block_sync_allowance": 10,
        "max_evidence_cache_entries": 500,
        "max_session_cache_entries": 500,
        "json_sort_relay_responses": true,
        "remote_cli_url": "http://localhost:8081",
        "user_agent": "",
        "validator_cache_size": 40000,
        "application_cache_size": 10000,
        "rpc_timeout": 30000,
        "pocket_prometheus_port": "8083",
        "prometheus_max_open_files": 3,
        "max_claim_age_for_proof_retry": 32,
        "proof_prevalidation": false,
        "ctx_cache_size": 20,
        "abci_logging": false,
        "show_relay_errors": true,
        "disable_tx_events": true,
        "iavl_cache_size": 5000000,
        "chains_hot_reload": true,
        "client_session_sync_allowance": 1
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
            version: 'RC-0.11.1',
            clientVersion: 'RC-0.11.1',
            image: 'rburgett/pocketcore:RC-0.11.1',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          // {
          //   version: 'BETA-0.11.1',
          //   clientVersion: 'BETA-0.11.1',
          //   image: 'rburgett/pocketcore:BETA-0.11.1',
          //   dataDir: '/root/pocket-data',
          //   walletDir: '/root/pocket-keys',
          //   configDir: '/root/.pocket/config',
          //   networks: [NetworkType.MAINNET, NetworkType.TESTNET],
          //   breaking: false,
          //   generateRuntimeArgs(data: CryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` start --${network.toLowerCase()}`;
          //   },
          // },
          // {
          //   version: 'BETA-0.11.0',
          //   clientVersion: 'BETA-0.11.0',
          //   image: 'rburgett/pocketcore:BETA-0.11.0',
          //   dataDir: '/root/pocket-data',
          //   walletDir: '/root/pocket-keys',
          //   configDir: '/root/.pocket/config',
          //   networks: [NetworkType.MAINNET, NetworkType.TESTNET],
          //   breaking: false,
          //   generateRuntimeArgs(data: CryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` start --${network.toLowerCase()}`;
          //   },
          // },
          {
            version: 'RC-0.10.4',
            clientVersion: 'RC-0.10.4',
            image: 'rburgett/pocketcore:RC-0.10.4',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
            async upgrade(data: CryptoNodeData): Promise<boolean> {
              const fs = new FS(new Docker());
              if(!data.configDir)
                return false;
              const configPath = path.join(data.configDir, Pocket.configName(data));
              const configExists = await fs.pathExists(configPath);
              if(!configExists)
                return false;
              const configJson = await fs.readFile(configPath);
              const config = JSON.parse(configJson);
              config.tendermint_config.Mempool = {
                ...config.tendermint_config.Mempool,
                Size: 18000,
                MaxTxsBytes: 2147483648,
                CacheSize: 18000,
                MaxTxBytes: 2097152,
              };
              if(!Object.keys(config.pocket_config).includes('client_session_sync_allowance'))
                config.pocket_config.client_session_sync_allowance = 1;
              if(data.network === NetworkType.TESTNET) {
                config.tendermint_config.P2P.Seeds = Pocket.defaultSeeds[NetworkType.TESTNET];
              } else {
                config.tendermint_config.P2P.Seeds = Pocket.defaultSeeds[NetworkType.MAINNET];
              }
              await fs.writeFile(configPath, JSON.stringify(config, null, '    '), 'utf8');
              return true;
            },
          },
          {
            version: 'RC-0.9.2',
            clientVersion: 'RC-0.9.2',
            image: 'rburgett/pocketcore:RC-0.9.2',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          {
            version: 'RC-0.9.1.3',
            clientVersion: 'RC-0.9.1.3',
            image: 'rburgett/pocketcore:RC-0.9.1.3',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          {
            version: 'RC-0.9.1.2',
            clientVersion: 'RC-0.9.1.2',
            image: 'rburgett/pocketcore:RC-0.9.1.2',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          {
            version: 'RC-0.9.1.1',
            clientVersion: 'RC-0.9.1.1',
            image: 'rburgett/pocketcore:RC-0.9.1.1',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          {
            version: 'RC-0.9.0',
            clientVersion: 'RC-0.9.0',
            image: 'rburgett/pocketcore:RC-0.9.0',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          {
            version: 'RC-0.8.3',
            clientVersion: 'RC-0.8.3',
            image: 'rburgett/pocketcore:RC-0.8.3',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()}`;
            },
          },
          {
            version: 'RC-0.8.2',
            clientVersion: 'RC-0.8.2',
            image: 'rburgett/pocketcore:RC-0.8.2',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
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

  static roles = [
    Role.VALIDATOR,
  ];

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 26656,
    [NetworkType.TESTNET]: 26656,
  };

  static defaultSeeds = {
    [NetworkType.MAINNET]: '7c0d7ec36db6594c1ffaa99724e1f8300bbd52d0@seed1.mainnet.pokt.network:26662,cdcf936d70726dd724e0e6a8353d8e5ba5abdd20@seed2.mainnet.pokt.network:26663,74b4322a91c4a7f3e774648d0730c1e610494691@seed3.mainnet.pokt.network:26662,b3235089ff302c9615ba661e13e601d9d6265b15@seed4.mainnet.pokt.network:26663',
    [NetworkType.TESTNET]: 'd90094952a3a67a99243cca645cdd5bd55fe8d27@seed1.testnet.pokt.network:26668,2a5258dcdbaa5ca6fd882451f5a725587427a793@seed2.testnet.pokt.network:26669,a37baa84a53f2aab1243986c1cd4eff1591e50d0@seed3.testnet.pokt.network:26668,fb18401cf435bd24a2e8bf75ea7041afcf122acf@seed4.testnet.pokt.network:26669',
  };

  static defaultCPUs = 16;

  static defaultMem = 24576;

  static generateConfig(client = Pocket.clients[0], network = NetworkType.MAINNET, peerPort = Pocket.defaultPeerPort[NetworkType.MAINNET], rpcPort = Pocket.defaultRPCPort[NetworkType.MAINNET], domain = ''): string {
    switch(client) {
      case NodeClient.CORE: {
        const config = JSON.parse(coreConfig);
        config.pocket_config.rpc_port = rpcPort.toString(10);
        config.pocket_config.remote_cli_url = `http://localhost:${rpcPort}`;
        config.tendermint_config.P2P.Seeds = Pocket.defaultSeeds[network];
        config.tendermint_config.P2P.ListenAddress = `tcp://0.0.0.0:${peerPort}`;
        return JSON.stringify(config, null, '    ');
      } default:
        return '';
    }
  }

  static configName(data: CryptoNodeData): string {
    return 'config.json';
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
  rpcPort: number;
  rpcUsername: string;
  rpcPassword: string;
  client: string;
  dockerCPUs = Pocket.defaultCPUs;
  dockerMem = Pocket.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  domain = '';
  publicKey = '';
  privateKeyEncrypted = '';
  address = '';
  role = Pocket.roles[0];

  constructor(data: PocketNodeData, docker?: Docker) {
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
    this.configDir = data.configDir || this.configDir;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Pocket.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.domain = data.domain || this.domain;
    this.address = data.address || this.address;
    this.publicKey = data.publicKey || this.publicKey;
    this.privateKeyEncrypted = data.privateKeyEncrypted || this.privateKeyEncrypted;
    this.role = data.role || this.role;

    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  toObject(): PocketNodeData {
    return {
      ...this._toObject(),
      address: this.address,
      domain: this.domain,
      publicKey: this.publicKey,
      privateKeyEncrypted: this.privateKeyEncrypted,
    };
  }

  async start(password?: string, simulateRelay = false): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = Pocket.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);

    if(!this.privateKeyEncrypted) {
      if(!password)
        throw new Error('You must pass in a password the first time you run start() on a validator. This password will be used to generate the key pair.');
      await this.generateKeyPair(password);
    }

    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);

    if(!running) {
      const {
        configDir: containerConfigDir,
        dataDir: containerDataDir,
        walletDir: containerWalletDir,
      } = versionData;

      await this._docker.pull(this.dockerImage, str => this._logOutput(str));

      const tmpdir = os.tmpdir();

      let { dataDir } = this;
      if(!dataDir) {
        dataDir = path.join(tmpdir, uuid());
        this.dataDir = dataDir;
      }
      await fs.ensureDir(dataDir);

      let { walletDir } = this;
      if(!walletDir) {
        walletDir = path.join(tmpdir, uuid());
        this.walletDir = walletDir;
      }
      await fs.ensureDir(walletDir);

      let { configDir } = this;
      if(!configDir) {
        configDir = path.join(tmpdir, uuid());
        this.configDir = configDir;
      }
      await fs.ensureDir(configDir);
      const configPath = this.configFilePath();
      const configExists = await fs.pathExists(configPath);
      if (!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');

      const genesisPath = this.genesisFilePath();
      const genesisExists = await fs.pathExists(genesisPath);
      if (!genesisExists)
        await fs.writeFile(genesisPath, PocketGenesis[this.network].trim(), 'utf8');

      const chainsPath = this.pocketChainsPath();
      const chainsExists = await fs.pathExists(chainsPath);
      if(!chainsExists) {
        const initialChainsData = [
          {
            id: '0001',
            url: `http://localhost:${this.rpcPort}/`,
            basic_auth: {
              username: '',
              password:'' ,
            },
          },
        ];
        await fs.writeFile(chainsPath, JSON.stringify(initialChainsData, null, '  '), 'utf8');
      }

      const keybaseExists = await fs.pathExists(path.join(walletDir, 'pocket-keybase.db'));
      if (!keybaseExists) {
        if(!password)
          throw new Error('In order to import the new account into the pocket node, the key password must be passed into the start() method on the first run.');
        const rawPrivatKey = await this.getRawPrivateKey(password);
        const args = [
          '-i',
          '--rm',
          '-v', `${configDir}:${containerConfigDir}`,
          '-v', `${dataDir}:${containerDataDir}`,
          '-v', `${walletDir}:${containerWalletDir}`,
          '--entrypoint', 'pocket',
        ];
        await new Promise<void>((resolve, reject) => {
          this._docker.run(
            this.dockerImage + ` accounts import-raw ${rawPrivatKey} --pwd-encrypt ${password}`,
            args,
            output => this._logOutput(output),
            err => {
              reject(err);
            },
            () => {
              resolve();
            },
            true,
          );
        });
        // await new Promise<void>((resolve, reject) => {
        //   this._docker.run(
        //     this.dockerImage + ` accounts set-validator ${this.address} --pwd ${password}`,
        //     args,
        //     output => this._logOutput(output),
        //     err => {
        //       reject(err);
        //     },
        //     () => {
        //       resolve();
        //     },
        //     true,
        //   );
        // });
      }

      await this._docker.createNetwork(this.dockerNetwork);

      // if(!password)
      //   throw new Error('Password is always required when running the start() method for pokt nodes.');

      const secretsDir = await getSecretsDir(this.id);
      const nodeKeyFileName = 'node_key.json';
      const nodeKeySecretPath = path.join(secretsDir, nodeKeyFileName);
      const privValKeyFileName = 'priv_val_key.json';
      const privValKeySecretPath = path.join(secretsDir, privValKeyFileName);

      if(!password) {
        const nodeKeyFileExists = await fs.pathExists(nodeKeySecretPath);
        const privValKeyFileExists = await fs.pathExists(privValKeySecretPath);
        if(!nodeKeyFileExists || !privValKeyFileExists)
          throw new Error('Password must be sent into start() method on first run in order to unlock the node.');
      } else {
        const privValStatePath = path.join(walletDir, 'priv_val_state.json');
        const privValStateExists = await fs.pathExists(privValStatePath);
        if(!privValStateExists)
          await fs.writeJson(privValStatePath, {
            height: '0',
            round: '0',
            step: 0,
          }, {spaces: 2});
        const privateKey = await this.getRawPrivateKey(password);
        const privateKeyB64 = Buffer.from(privateKey, 'hex').toString('base64');
        await fs.writeJson(nodeKeySecretPath, {
          priv_key: {
            type: 'tendermint/PrivKeyEd25519',
            value: privateKeyB64,
          },
        }, {spaces: 2});
        await fs.writeJson(privValKeySecretPath, {
          address: this.address,
          pub_key: {
            type: 'tendermint/PubKeyEd25519',
            value: Buffer.from(this.publicKey, 'hex').toString('base64'),
          },
          priv_key: {
            type: 'tendermint/PrivKeyEd25519',
            value: privateKeyB64,
          },
        }, {spaces: 2});
      }

      const command = [
        ...versionData.generateRuntimeArgs(this).trim().split(/\s+/),
      ];
      if(simulateRelay)
        command.push('--simulateRelay');

      const composeConfig = {
        services: {
          [this.id]: {
            image: this.dockerImage,
            container_name: this.id,
            networks: [
              this.dockerNetwork,
            ],
            deploy: {
              resources: {
                limits: {
                  cpus: this.dockerCPUs.toString(10),
                  memory: this.dockerMem.toString(10) + 'MB',
                },
              },
            },
            ports: [
              `${this.rpcPort}:${this.rpcPort}/tcp`,
              `${this.peerPort}:${this.peerPort}/tcp`,
            ],
            volumes: [
              `${configDir}:${containerConfigDir}`,
              `${dataDir}:${containerDataDir}`,
              `${walletDir}:${containerWalletDir}`,
            ],
            entrypoint: [
              'pocket',
            ],
            command,
            secrets: [
              'node_key.json',
              'priv_val_key.json',
            ],
            restart: `on-failure:${this.restartAttempts}`,
          },
        },
        networks: {
          [this.dockerNetwork]: {
            external: true,
          },
        },
        secrets: {
          'node_key.json': {
            file: nodeKeySecretPath,
          },
          'priv_val_key.json': {
            file: privValKeySecretPath,
          },
        },
      };

      const composeConfigPath = path.join('/', 'tmp', uuid());
      await fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});

      const args = [
        'up',
        '-d',
        // '--remove-orphans',
      ];
      const exitCode = await new Promise<number>((resolve, reject) => {
        this._docker.composeDo(
          composeConfigPath,
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

      // await fs.remove(secretsDir);

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
    return Pocket.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort,
      this.domain);
  }

  configFilePath(): string {
    return path.join(this.configDir, 'config.json');
  }

  genesisFilePath(): string {
    return path.join(this.configDir, 'genesis.json');
  }

  pocketChainsPath(): string {
    return path.join(this.configDir, 'chains.json');
  }

  async stakeValidator(amount: string, password: string): Promise<string> {
    const versions = Pocket.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const {
      configDir: containerConfigDir,
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
    } = versionData;
    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);
    const chainsJson = await this._fs.readFile(this.pocketChainsPath(), 'utf8');
    const chainsData: {id: string}[] = JSON.parse(chainsJson);
    const chains = chainsData.map(c => c.id);
    const fee = 10000;
    const command = `nodes stake custodial ${this.address} ${amount} ${chains.join(',')} https://${this.domain}:443 ${this.network.toLowerCase()} ${fee} false --pwd ${password}`;
    const txPatt = /[0-9a-f]{64}/i;
    let outputStr = '';
    if(running) {
      await new Promise<void>((resolve, reject) => {
        this._docker.exec(
          this.id,
          [],
          `pocket ${command}`,
          output => {
            outputStr += `${output}\n`;
            this._logOutput(output);
          },
          err => reject(err),
          () => resolve(),
          true,
        );
      });
    } else {
      const args = [
        '-i',
        '--rm',
        '-v', `${this.configDir}:${containerConfigDir}`,
        '-v', `${this.dataDir}:${containerDataDir}`,
        '-v', `${this.walletDir}:${containerWalletDir}`,
        '--entrypoint', 'pocket',
      ];
      await new Promise<void>((resolve, reject) => {
        this._docker.run(
          this.dockerImage + ' ' + command,
          args,
          output => {
            outputStr += `${output}\n`;
            this._logOutput(output);
          },
          err => reject(err),
          () => resolve(),
          true,
        );
      });
    }
    const match = outputStr.match(txPatt);
    return match ? match[0] : '';
  }

  getPocketJsInstance(): PocketJS {
    const dispatcher = new URL(`http://localhost:${this.rpcPort}`);
    const configuration = new Configuration(5, 1000, 0, 40000, undefined, undefined, undefined, undefined, undefined, undefined, false);
    return new PocketJS([dispatcher], new HttpRpcProvider(dispatcher), configuration);
  }

  async generateKeyPair(password: string): Promise<boolean> {
    try {
      const pocket = this.getPocketJsInstance();
      // const dispatcher = new URL(`http://localhost:${this.rpcPort}`);
      // const configuration = new Configuration(5, 1000, 0, 40000, undefined, undefined, undefined, undefined, undefined, undefined, false);
      // const pocket = new PocketJS([dispatcher], new HttpRpcProvider(dispatcher), configuration);
      const account = await pocket.keybase.createAccount(password);
      if (isError(account)) {
        this._logError(account);
        return false;
      } else {
        const ppk = await pocket.keybase.exportPPKfromAccount(account.addressHex, password, '', password);
        if (isError(ppk)) {
          this._logError(ppk);
          return false;
        } else {
          this.privateKeyEncrypted = ppk;
          this.address = account.addressHex;
          this.publicKey = account.publicKey.toString('hex');
          return true;
        }
      }
    } catch (err) {
      this._logError(err);
      return false;
    }
  }

  async importAccountFromRawPrivateKey(rawPrivateKey: string, password: string): Promise<boolean> {
    try {
      const pocket = this.getPocketJsInstance();
      const account = await pocket.keybase.importAccount(Buffer.from(rawPrivateKey, 'hex'), password);
      if(isError(account)) {
        this._logError(account);
        return false;
      } else {
        const ppk = await pocket.keybase.exportPPKfromAccount(account.addressHex, password, '', password);
        if(isError(ppk)) {
          this._logError(ppk);
          return false;
        } else {
          this.privateKeyEncrypted = ppk;
          this.address = account.addressHex;
          this.publicKey = account.publicKey.toString('hex');
          return true;
        }
      }
    } catch(err) {
      this._logError(err);
      return false;
    }
  }

  async getRawPrivateKey(password: string): Promise<string> {
    try {
      const pocket = this.getPocketJsInstance();
      const account = await pocket.keybase.importPPKFromJSON(password, this.privateKeyEncrypted, password);
      if(isError(account))
        throw account;
      const unlockedAccount = await pocket.keybase.getUnlockedAccount(account.addressHex, password);
      if(isError(unlockedAccount))
        throw unlockedAccount;
      return unlockedAccount.privateKey.toString('hex');
    } catch(err) {
      this._logError(err);
      return '';
    }
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

  async rpcGetBalance(): Promise<string> {
    try {
      const pocket = this.getPocketJsInstance();
      if(!pocket.rpc)
        return '0';
      const res = await pocket.rpc()?.query.getBalance(this.address, BigInt('0'), this._requestTimeout);
      if(isError(res))
        throw res;
      else if(!res)
        return '0';
      else
        return res.balance.toString(10);
    } catch(err) {
      this._logError(err);
      return '0';
    }

  }

  async getStatus(): Promise<string> {
    let status;
    try {
      if(this.remote) {
        const version = await this.rpcGetVersion();
        status = version ? Status.RUNNING : Status.STOPPED;
      } else {
        const stats = await this._docker.containerInspect(this.id);
        status = stats && stats.State.Running ? Status.RUNNING : Status.STOPPED;
      }
    } catch(err) {
      status = Status.STOPPED;
    }

    if(!this.remote && status !== Status.STOPPED) {
      try {
        let output = '';
        await new Promise<void>(resolve => {
          this._docker.exec(
            this.id,
            [],
            'curl -s http://localhost:26657/status',
            str => {
              output += str;
            },
            err => {
              this._logError(err);
            },
            () => {
              resolve();
            },
            false,
          );
        });
        const statusData = JSON.parse(output.trim());
        const { catching_up: catchingUp } = statusData.result.sync_info;
        status = catchingUp ? Status.SYNCING : status;
      } catch(err) {
        // do nothing with the error
      }
    }
    return status;
  }

  async getValidatorInfo(): Promise<PocketValidatorInfo|null> {
    try {
      const pocket = this.getPocketJsInstance();
      if(!pocket.rpc)
        return null;
      const res = await pocket.rpc()?.query.getNode(this.address, BigInt('0'), this._requestTimeout);
      if(isError(res))
        throw res;
      else if(!res)
        return null;
      else {
        const { node } = res;
        return {
          jailed: node.jailed,
          stakedAmount: node.stakedTokens.toString(),
          unstakeDate: node.unstakingCompletionTimestamp || '',
          url: node.serviceURL.toString(),
          address: node.address,
          publicKey: node.publicKey,
          chains: node.chains,
        };
      }
    } catch(err) {
      this._logError(err);
      return null;
    }
  }

  /**
   * @param {string} password
   * @param {string} amount send amount in POKT
   * @param {string} toAddress
   * @param {string} memo
   * @returns {Promise<string>}
   */
  async send(password: string, amount: string, toAddress: string, memo: string): Promise<string> {
    const privateKey = await this.getRawPrivateKey(password);
    const pocket = this.getPocketJsInstance();
    const transactionSender = pocket.withPrivateKey(privateKey);
    if(isError(transactionSender))
      throw transactionSender;
    const rawTxResponse = await transactionSender
      .send(this.address, toAddress, math.multiply(math.bignumber(amount), math.bignumber('1000000')).toString())
      .submit(this.network === NetworkType.TESTNET ? 'testnet' : 'mainnet', '10000', CoinDenom.Upokt, memo, this._requestTimeout);
    if(isError(rawTxResponse))
      throw rawTxResponse;
    return rawTxResponse.hash;
  }

}
