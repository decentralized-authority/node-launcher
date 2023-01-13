import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid } from 'uuid';
import request from 'superagent';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { EthereumPreMerge } from '../shared/ethereum-pre-merge';
import { filterVersionsByNetworkType } from '../../util';
import * as genesis from './config/genesis';

const coreConfig = `
moniker = "{{MONIKER}}"
chainid = "exchain-66"
db_dir = "data"
node_key_file = "config/node_key.json"
genesis_file = "config/genesis.json"
priv_validator_key_file = "config/priv_validator_key.json"
priv_validator_state_file = "data/priv_validator_state.json"
addr_book_file = "config/addrbook.json"
db_backend = "rocksdb"
fast_sync = true
auto_fast_sync = true
log_level = "error"
log_format = "plain"
minimum-gas-prices = "0.0000000001okt"

[rest]
laddr = "tcp://0.0.0.0:{{RPC_PORT}}"

[p2p]
laddr = "tcp://0.0.0.0:{{PEER_PORT}}"
`;

export class OKEX extends EthereumPreMerge {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || OKEX.clients[0];
    let versions: VersionDockerImage[];
    switch (client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '1.5.6',
            clientVersion: '1.5.6',
            image: 'okexchain/fullnode-mainnet:v1.5.6',
            dataDir: '/root/.exchaind/data',
            walletDir: '/root/keystore',
            configDir: '/root/.exchaind/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ' start --home /root/.exchaind';
            },
          },
          {
            version: '1.1.4.3',
            clientVersion: '1.1.4.3',
            image: 'okexchain/fullnode-mainnet:v1.1.4.3',
            dataDir: '/root/.exchaind/data',
            walletDir: '/root/keystore',
            configDir: '/root/.exchaind/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ' start --home /root/.exchaind';
            },
          },
          {
            version: '1.1.4',
            clientVersion: '1.1.4',
            image: 'okexchain/fullnode-mainnet:v1.1.4',
            dataDir: '/root/.exchaind/data',
            walletDir: '/root/keystore',
            configDir: '/root/.exchaind/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ' start --home /root/.exchaind';
            },
          },
          {
            version: '1.1.2',
            clientVersion: '1.1.2',
            image: 'okexchain/fullnode-mainnet:v1.1.2',
            dataDir: '/root/.exchaind/data',
            walletDir: '/root/keystore',
            configDir: '/root/.exchaind/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ' start --home /root/.exchaind';
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
    [NetworkType.MAINNET]: 8545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 26656,
  };

  static defaultCPUs = 4;

  static defaultMem = 8192;

  static generateConfig(client = OKEX.clients[0], network = NetworkType.MAINNET, peerPort = OKEX.defaultPeerPort[NetworkType.MAINNET], rpcPort = OKEX.defaultRPCPort[NetworkType.MAINNET], moniker = uuid()): string {
    switch (client) {
      case NodeClient.CORE:
        return coreConfig
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .replace('{{MONIKER}}', moniker)
          .trim();
      default:
        return '';
    }
  }

  static configName(data: CryptoNodeData): string {
    return 'config.toml';
  }

  id: string;
  ticker = 'oec';
  name = 'OKEx';
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
  dockerCPUs = OKEX.defaultCPUs;
  dockerMem = OKEX.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  role = OKEX.roles[0];

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || OKEX.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || OKEX.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || OKEX.clients[0];
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
    const versions = OKEX.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    if(docker)
      this._docker = docker;
  }

  async start(): Promise<ChildProcess[]> {
    const versions = OKEX.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if (!versionData)
      throw new Error(`Unknown version ${this.version}`);

    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);

    if(!running) {
      const {
        dataDir: containerDataDir,
        walletDir: containerWalletDir,
        configDir: containerConfigDir,
      } = versionData;
      let args = [
        '-d',
        `--restart=on-failure:${this.restartAttempts}`,
        '--memory', this.dockerMem.toString(10) + 'MB',
        '--cpus', this.dockerCPUs.toString(10),
        '--name', this.id,
        '--network', this.dockerNetwork,
        '-p', `${this.rpcPort}:${this.rpcPort}/tcp`,
        '-p', `${this.peerPort}:${this.peerPort}/tcp`,
        '-p', `${this.peerPort}:${this.peerPort}/udp`,
        '--entrypoint', '/go/bin/exchaind',
      ];
      const tmpdir = os.tmpdir();
      const dataDir = this.dataDir || path.join(tmpdir, uuid());
      args = [...args, '-v', `${dataDir}:${containerDataDir}`];
      await fs.ensureDir(dataDir);

      args = [...args, '-v', `${this.walletDir}:${containerWalletDir}`];
      await fs.ensureDir(this.walletDir);

      const configDir = this.configDir || path.join(tmpdir, uuid());
      const configConfigDir = path.join(configDir, 'config');
      const configConfigExists = await fs.pathExists(configConfigDir);
      if (!configConfigExists) {
        await fs.ensureDir(configDir);
        await fs.ensureDir(configConfigDir);
        const configPath = path.join(configConfigDir, OKEX.configName(this));
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');
        const genesisPath = path.join(configConfigDir, 'genesis.json');
        await fs.writeFile(genesisPath, genesis.mainnet, 'utf8');
      }
      args = [...args, '-v', `${configConfigDir}:${containerConfigDir}`];

      await this._docker.pull(this.dockerImage, str => this._logOutput(str));

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
    return OKEX.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort,
      this.id,
    );
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
      const matches = result.split('v');
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
}
