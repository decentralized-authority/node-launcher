import { CryptoNode, CryptoNodeData, CryptoNodeStatic, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeEvent, NodeType, Role, Status } from '../../constants';
import { filterVersionsByNetworkType, generateRandom, timeout } from '../../util';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import path from 'path';
import os from 'os';
import { EventEmitter } from 'events';
import { FS } from '../../util/fs';

const defaultDocker = new Docker();

const coreConfig = `
server=1
listen=1
txindex=1
[{{NETWORK}}]
datadir=/opt/blockchain/data
walletdir=/opt/blockchain/wallets
rpcuser={{RPC_USERNAME}}
rpcpassword={{RPC_PASSWORD}}
rpcallowip=0.0.0.0/0
rpcbind=0.0.0.0
port={{PEER_PORT}}
rpcport={{RPC_PORT}}
`;

export class Bitcoin extends EventEmitter implements CryptoNodeData, CryptoNode, CryptoNodeStatic {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Bitcoin.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '24.1.0',
            clientVersion: '24.1.0',
            image: 'rburgett/bitcoin:v24.1.0',
            dataDir: '/opt/blockchain/data',
            walletDir: '/opt/blockchain/wallets',
            configDir: '/opt/blockchain/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` bitcoind -conf=${path.join(this.configDir, Bitcoin.configName(data))}` + (data.network === NetworkType.TESTNET ? ' -testnet' : '');
            },
          },
          {
            version: '23.2.0',
            clientVersion: '23.2.0',
            image: 'rburgett/bitcoin:v23.2.0',
            dataDir: '/opt/blockchain/data',
            walletDir: '/opt/blockchain/wallets',
            configDir: '/opt/blockchain/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` bitcoind -conf=${path.join(this.configDir, Bitcoin.configName(data))}` + (data.network === NetworkType.TESTNET ? ' -testnet' : '');
            },
          },
          {
            version: '22.1.0',
            clientVersion: '22.1.0',
            image: 'rburgett/bitcoin:v22.1.0',
            dataDir: '/opt/blockchain/data',
            walletDir: '/opt/blockchain/wallets',
            configDir: '/opt/blockchain/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` bitcoind -conf=${path.join(this.configDir, Bitcoin.configName(data))}` + (data.network === NetworkType.TESTNET ? ' -testnet' : '');
            },
          },
          {
            version: '0.21.0',
            clientVersion: '0.21.0',
            image: 'rburgett/bitcoin:v0.21.0',
            dataDir: '/opt/blockchain/data',
            walletDir: '/opt/blockchain/wallets',
            configDir: '/opt/blockchain/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` bitcoind -conf=${path.join(this.configDir, Bitcoin.configName(data))}` + (data.network === NetworkType.TESTNET ? ' -testnet' : '');
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

  static roles = [
    Role.NODE,
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

  static defaultMem = 8192;

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

  static getAvailableUpgrade(node: CryptoNodeData, versions: VersionDockerImage[], nonBreaking = false): VersionDockerImage|null {
    const { version } = node;
    const idx = versions.findIndex(v => v.version === version);
    // Already the latest version
    if(idx < 1)
      return null;
    let updateIdx = 0;
    for(let i = idx - 1; i >= 0; i--) {
      if(versions[i].breaking) {
        if(nonBreaking) {
          updateIdx = i + 1;
          // There is no non-breaking update available
          if(updateIdx === idx)
            return null;
          break;
        } else {
          updateIdx = i;
          break;
        }
      }
    }
    return versions[updateIdx];
  }

  static async upgradeNode(node: CryptoNodeData, versionData: VersionDockerImage): Promise<boolean> {
    const {
      version: origVersion,
      clientVersion: origClientVersion,
      dockerImage: origDockerImage,
    } = node;
    node.version = versionData.version;
    node.clientVersion = versionData.clientVersion;
    node.dockerImage = versionData.image;
    if(versionData.upgrade) {
      let success = false;
      let upgradeErr: Error|null = null;
      try {
        success = await versionData.upgrade(node);
      } catch(err) {
        upgradeErr = err;
      }
      if(!success) {
        node.version = origVersion;
        node.clientVersion = origClientVersion;
        node.dockerImage = origDockerImage;
        if(upgradeErr)
          throw upgradeErr;
        else
          return false;
      }
    }
    return true;
  }

  static configName(data: CryptoNodeData): string {
    return 'bitcoin.conf';
  }

  id: string;
  ticker = 'btc';
  name = 'Bitcoin';
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
  dockerCPUs = Bitcoin.defaultCPUs;
  dockerMem = Bitcoin.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  createdAt = '';
  updatedAt = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  role = Bitcoin.roles[0];
  restartAttempts = 10;

  _docker = defaultDocker;
  _fs = new FS(defaultDocker);
  _instance?: ChildProcess;
  _instances: ChildProcess[] = [];
  _requestTimeout = 10000;
  _logError(err: string|Error): void {
    err = typeof err === 'string' ? new Error(err) : err;
    this.emit(NodeEvent.ERROR, err);
  }
  _logOutput(output: string): void {
    this.emit(NodeEvent.OUTPUT, output);
  }
  _logClose(exitCode: number): void {
    this.emit(NodeEvent.CLOSE, exitCode);
  }

  constructor(data: CryptoNodeData, docker?: Docker) {
    super();
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Bitcoin.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Bitcoin.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || generateRandom();
    this.rpcPassword = data.rpcPassword || generateRandom();
    this.client = data.client || Bitcoin.clients[0];
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
    const versions = Bitcoin.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    this.restartAttempts = data.restartAttempts || this.restartAttempts;
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  endpoint(): string {
    if(this.remote) {
      if(!this.remoteDomain || !this.remoteProtocol)
        throw new Error('remoteDomain and remoteProtocol must be entered for a remote domain.');
      if(!this.rpcPort
        || (this.remoteProtocol === 'http' && this.rpcPort === 80)
        || (this.remoteProtocol === 'https' && this.rpcPort === 443)
      ) {
        return `${this.remoteProtocol}://${this.remoteDomain}`;
      } else {
        return `${this.remoteProtocol}://${this.remoteDomain}:${this.rpcPort}`;
      }
    } else {
      return `http://localhost:${this.rpcPort}`;
    }
  }

  _toObject(): CryptoNodeData {
    return {
      id: this.id,
      ticker: this.ticker,
      network: this.network,
      peerPort: this.peerPort,
      rpcPort: this.rpcPort,
      rpcUsername: this.rpcUsername,
      rpcPassword: this.rpcPassword,
      client: this.client,
      dockerCPUs: this.dockerCPUs,
      dockerMem: this.dockerMem,
      dockerNetwork: this.dockerNetwork,
      dataDir: this.dataDir,
      walletDir: this.walletDir,
      configDir: this.configDir,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      remote: this.remote,
      remoteDomain: this.remoteDomain,
      remoteProtocol: this.remoteProtocol,
      version: this.version,
      clientVersion: this.clientVersion,
      archival: this.archival,
      dockerImage: this.dockerImage,
      role: this.role,
      restartAttempts: this.restartAttempts,
    };
  }

  toObject(): CryptoNodeData {
    return this._toObject();
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

  async start(): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = Bitcoin.versions(this.client, this.network);
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
        '-d',
        `--restart=on-failure:${this.restartAttempts}`,
        '--memory', this.dockerMem.toString(10) + 'MB',
        '--cpus', this.dockerCPUs.toString(10),
        '--name', this.id,
        '--network', this.dockerNetwork,
        '-p', `${this.rpcPort}:${this.rpcPort}/tcp`,
        '-p', `${this.peerPort}:${this.peerPort}/tcp`,
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
      const configPath = path.join(configDir, Bitcoin.configName(this));
      const configExists = await fs.pathExists(configPath);
      if (!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');
      args = [...args, '-v', `${configDir}:${containerConfigDir}`];

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

  async stop(): Promise<void> {
    try {
      await this._docker.stop(this.id);
      await this._docker.rm(this.id);
      await timeout(1000);
    } catch(err) {
      this._logError(err);
    }
  }

  instances(): ChildProcess[] {
    return [...this._instances];
  }

  _runCheck(method: string): void {
    if(!this.remote && !this._instance)
      throw new Error(`Instance must be running before you can call ${method}()`);
  }

  async isRunning(): Promise<boolean> {
    if(this.remote) {
      try {
        const version = await this.rpcGetVersion();
        return !!version;
      } catch(err) {
        // ignore error
        return false;
      }
    } else {
      const instance = this._instance;
      return !(!instance || typeof instance.exitCode === 'number');
    }
  }

  async rpcGetVersion(): Promise<string> {
    this._runCheck('rpcGetVersion');
    try {
      const { body } = await request
        .post(this.endpoint())
        .set('Accept', 'application/json')
        .auth(this.rpcUsername, this.rpcPassword)
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '1.0',
          method: 'getnetworkinfo',
          params: [],
        });
      const matchPatt = /:(.+?)[/(]/;
      if(body && body.result && body.result.subversion && matchPatt.test(body.result.subversion)) {
        const matches = body.result.subversion.match(matchPatt);
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
      this._runCheck('rpcGetBlockCount');
      const { body } = await request
        .post(this.endpoint())
        .set('Accept', 'application/json')
        .auth(this.rpcUsername, this.rpcPassword)
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '1.0',
          method: 'getblockcount',
          params: [],
        });
      return String(body.result);
    } catch(err) {
      this._logError(err);
      return '0';
    }
  }

  async getMemUsage(): Promise<[usagePercent: string, used: string, allocated: string]> {
    try {
      this._runCheck('getMemUsage');
      const containerStats = await this._docker.containerStats(this.id);
      const percent = containerStats.MemPerc;
      const split = containerStats.MemUsage
        .split('/')
        .map((s: string): string => s.trim());
      if(split.length > 1) {
        return [percent, split[0], split[1]];
      } else {
        throw new Error('Split containerStats/MemUsage length less than two.');
      }
    } catch(err) {
      this._logError(err);
      return ['0', '0', '0'];
    }
  }

  async getCPUUsage(): Promise<string> {
    try {
      this._runCheck('getCPUUsage');
      const containerStats = await this._docker.containerStats(this.id);
      return containerStats.CPUPerc;
    } catch(err) {
      this._logError(err);
      return '0';
    }
  }

  async getStartTime(): Promise<string> {
    try {
      this._runCheck('getStartTime');
      const stats = await this._docker.containerInspect(this.id);
      return stats ? stats.State.StartedAt : '';
    } catch(err) {
      this._logError(err);
      return '';
    }
  }

  async getStatus(): Promise<string> {
    try {
      if(this.remote) {
        const version = await this.rpcGetVersion();
        return version ? Status.RUNNING : Status.STOPPED;
      } else {
        const stats = await this._docker.containerInspect(this.id);
        return stats && stats.State.Running ? Status.RUNNING : Status.STOPPED;
      }
    } catch(err) {
      return Status.STOPPED;
    }
  }

}
