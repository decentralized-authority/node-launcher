import { CryptoNode, CryptoNodeData, CryptoNodeStatic, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeEvent, NodeType, Status } from '../../constants';
import { generateRandom } from '../../util';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { EventEmitter } from 'events';

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

  static versions(client = Bitcoin.clients[0]): VersionDockerImage[] {
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
              return ` bitcoind -conf=${this.configPath}` + (data.network === NetworkType.TESTNET ? ' -testnet' : '');
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

  _docker = new Docker();
  _instance?: ChildProcess;
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
    this.dockerCpus = data.dockerCpus || this.dockerCpus;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configPath = data.configPath || this.configPath;
    const versions = Bitcoin.versions(this.client);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    this.dockerImage = data.dockerImage || (versions && versions[0] ? versions[0].image : '');
    if(docker)
      this._docker = docker;
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

  stop():Promise<void> {
    return new Promise<void>(resolve => {
      if(this._instance) {
        this._instance.on('exit', () => {
          clearTimeout(timeout);
          resolve();
        });
        this._instance.kill();
        const timeout = setTimeout(() => {
          this._docker.stop(this.id)
            .then(() => resolve())
            .catch(err => {
              this._logError(err);
              resolve();
            });
        }, 30000);
      } else {
        resolve();
      }
    });
  }

  async rpcGetVersion(): Promise<string> {
    if(!this._instance)
      throw new Error('Instance must be running before you can call rpcGetVersion()');
    try {
      const { body } = await request
        .post(`http://localhost:${this.rpcPort}/`)
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

  async rpcGetBlockCount(): Promise<number> {
    try {
      const { body } = await request
        .post(`http://localhost:${this.rpcPort}/`)
        .set('Accept', 'application/json')
        .auth(this.rpcUsername, this.rpcPassword)
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '1.0',
          method: 'getblockcount',
          params: [],
        });
      return body.result;
    } catch(err) {
      this._logError(err);
      return 0;
    }
  }

  async getMemUsage(): Promise<[usagePercent: string, used: string, allocated: string]> {
    try {
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
      const containerStats = await this._docker.containerStats(this.id);
      return containerStats.CPUPerc;
    } catch(err) {
      this._logError(err);
      return '0';
    }
  }

  async getStartTime(): Promise<string> {
    try {
      const stats = await this._docker.containerInspect(this.id);
      return stats.State.StartedAt;
    } catch(err) {
      this._logError(err);
      return '';
    }
  }

  async getStatus(): Promise<string> {
    try {
      const stats = await this._docker.containerInspect(this.id);
      return stats.State.Running ? Status.RUNNING : Status.STOPPED;
    } catch(err) {
      return Status.STOPPED;
    }
  }

}
