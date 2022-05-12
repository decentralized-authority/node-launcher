import { Ethereum } from '../ethereum/ethereum';
import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { timeout } from '../../util';
import * as coreConfig from './config/core';
import { Docker } from '../../util/docker';
import { v4 as uuid } from 'uuid';
import { FS } from '../../util/fs';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import * as genesis from './config/genesis';
import { pathExists } from 'fs-extra';

interface PolygonCryptoNodeData extends CryptoNodeData {
  heimdallDockerImage?: string
  heimdallDockerCPUs?: number
  heimdallDockerMem?: number
  heimdallPeerPort?: number
  heimdallRPCPort?: number
}

interface PolygonVersionDockerImage extends VersionDockerImage {
  heimdallImage: string
  heimdallDataDir: string
  heimdallWalletDir: string
  heimdallConfigDir: string
  generateHeimdallRuntimeArgs: (data: CryptoNodeData) => string
}

export class Polygon extends Ethereum {

  static versions(client: string, networkType: string): PolygonVersionDockerImage[] {
    client = client || Polygon.clients[0];
    let versions: PolygonVersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '0.2.14',
            clientVersion: '0.2.14',
            image: 'maticnetwork/bor:v0.2.14',
            dataDir: '/root/data',
            walletDir: '/root/keys',
            configDir: '/root/config',
            heimdallImage: 'maticnetwork/heimdall:v0.2.9',
            heimdallDataDir: '/root/.heimdalld/data',
            heimdallWalletDir: '/root/keys',
            heimdallConfigDir: '/root/.heimdalld/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { id = '' } = data;
              return ` bor --config=${this.configDir}/${Polygon.fileName.config} --bor.heimdall http://${Polygon.generateHeimdallDockerName(id)}:1317 --pprof --pprof.port 7071 --pprof.addr 0.0.0.0`;
            },
            generateHeimdallRuntimeArgs(data: CryptoNodeData): string {
              return ' /bin/bash /start.sh';
            },
          },
        ];
        break;
      default:
        versions = [];
    }
    return versions
      .filter(v => v.networks.includes(networkType));
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
    [NetworkType.MAINNET]: 8545,
    [NetworkType.TESTNET]: 8545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 30303,
    [NetworkType.TESTNET]: 30303,
  };

  static defaultHeimdallRPCPort = {
    [NetworkType.MAINNET]: 1317,
    [NetworkType.TESTNET]: 1317,
  };

  static defaultHeimdallPeerPort = {
    [NetworkType.MAINNET]: 26656,
    [NetworkType.TESTNET]: 26656,
  };

  static defaultCPUs = 16;

  static defaultMem = 32768;

  static heimdallDefaultCPUs = 2;

  static heimdallDefaultMem = 2048;

  static generateConfig(client: Polygon|string = Polygon.clients[0], network = NetworkType.MAINNET, peerPort = Polygon.defaultPeerPort[NetworkType.MAINNET], rpcPort = Polygon.defaultRPCPort[NetworkType.MAINNET]): string {
    let clientStr: string;
    if(typeof client === 'string') {
      clientStr = client;
    } else {
      clientStr = client.client;
      network = client.network || network;
      peerPort = client.peerPort || peerPort;
      rpcPort = client.rpcPort || rpcPort;
    }
    let baseConfig: string;
    switch(clientStr) {
      case NodeClient.CORE:
        baseConfig = coreConfig.borConfig;
        break;
      default:
        baseConfig = '';
    }
    let bootstrapNodes: string;
    if(network === NetworkType.MAINNET) {
      bootstrapNodes = '"enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303", "enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303"';
    } else if(network === NetworkType.TESTNET) {
      bootstrapNodes = '"enode://095c4465fe509bd7107bbf421aea0d3ad4d4bfc3ff8f9fdc86f4f950892ae3bbc3e5c715343c4cf60c1c06e088e621d6f1b43ab9130ae56c2cacfd356a284ee4@18.213.200.99:30303"';
    } else {
      bootstrapNodes = '';
    }
    return baseConfig
      .replace(/{{BOOTSTRAP_NODES}}/, bootstrapNodes)
      .replace(/{{RPC_PORT}}/, rpcPort.toString(10))
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10))
      .replace(/{{NETWORK_ID}}/, Polygon.getBorChainId(network));
  }

  static generateHeimdallConfig(id: string, peerPort: number, network: string): string {
    let seeds: string;
    switch(network) {
      case NetworkType.MAINNET:
        seeds = 'f4f605d60b8ffaaf15240564e58a81103510631c@159.203.9.164:26656,4fb1bc820088764a564d4f66bba1963d47d82329@44.232.55.71:26656';
        break;
      case NetworkType.TESTNET:
        seeds = '4cd60c1d76e44b05f7dfd8bab3f447b119e87042@54.147.31.250:26656,b18bbe1f3d8576f4b73d9b18976e71c65e839149@34.226.134.117:26656';
        break;
      default:
        seeds = '';
    }
    return coreConfig.heimdallConfig
      .replace(/{{MONIKER}}/, id)
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10))
      .replace(/{{SEEDS}}/, seeds);
  }

  static generateHeimdallServerConfig(borName: string, borRPCPort: number): string {
    return coreConfig.heimdallServerConfig
      .replace(/{{BOR_NAME}}/, borName)
      .replace(/{{BOR_RPC_PORT}}/, borRPCPort.toString(10));
  }

  static generateHeimdallDockerName(id: string): string {
    return id + '-heimdall';
  }

  static getHeimdallChainId(network: string): string {
    switch(network) {
      case NetworkType.MAINNET:
        return 'heimdall-137';
      case NetworkType.TESTNET:
        return 'heimdall-80001';
      default: return '';
    }
  }

  static getBorChainId(network: string): string {
   switch(network) {
     case NetworkType.MAINNET:
       return '137';
     case NetworkType.TESTNET:
       return '80001';
     default: return '';
   }
  }

  static fileName = {
    config: 'config.toml',
    heimdallConfig: 'config.toml',
    heimdallServerConfig: 'heimdall-config.toml',
    genesis: 'genesis.json',
  };

  id: string;
  ticker = 'matic';
  name = 'Polygon';
  version: string;
  clientVersion: string;
  archival = false;
  dockerImage: string;
  heimdallDockerImage: string;
  network: string;
  peerPort: number;
  rpcPort: number;
  heimdallRPCPort: number;
  heimdallPeerPort: number;
  rpcUsername: string;
  rpcPassword: string;
  client: string;
  dockerCPUs = Polygon.defaultCPUs;
  dockerMem = Polygon.defaultMem;
  heimdallDockerCPUs = Polygon.heimdallDefaultCPUs;
  heimdallDockerMem = Polygon.heimdallDefaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';

  constructor(data: PolygonCryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Polygon.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Polygon.defaultRPCPort[this.network];
    this.heimdallPeerPort = data.heimdallPeerPort || Polygon.defaultHeimdallPeerPort[this.network];
    this.heimdallRPCPort = data.heimdallRPCPort || Polygon.defaultHeimdallRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Polygon.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.heimdallDockerCPUs = data.heimdallDockerCPUs || this.heimdallDockerCPUs;
    this.heimdallDockerMem = data.heimdallDockerMem || this.heimdallDockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.walletDir;
    this.configDir = data.configDir || this.configDir;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Polygon.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.heimdallDockerImage = this.remote ? '' : data.heimdallDockerImage ? data.heimdallDockerImage : (versionObj.heimdallImage || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  async start(): Promise<ChildProcess[]> {

    const versions = Polygon.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);

    const {
      heimdallArgs,
      borArgs,
    } = await this.prestart(versionData);

    const heimdallInstance = this.startHeimdall(versionData, heimdallArgs);
    const borInstance = this.startBor(versionData, borArgs);

    this._instance = borInstance;
    this._instances = [
      borInstance,
      heimdallInstance,
    ];
    return this.instances();
  }

  async prestart(versionData: PolygonVersionDockerImage): Promise<{heimdallArgs: string[], borArgs: string[]}> {
    const fs = this._fs;
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configDir: containerConfigDir,
      heimdallDataDir: containerHeimdallDataDir,
      heimdallWalletDir: containerHeimdallWalletDir,
      heimdallConfigDir: containerHeimdallConfigDir,
    } = versionData;

    const tmpdir = os.tmpdir();

    const heimdallStartScriptPath = path.join(tmpdir, uuid());
    const heimdallStartScript = 'heimdalld start & heimdalld rest-server';
    await fs.writeFile(heimdallStartScriptPath, heimdallStartScript, 'utf8');

    let borArgs = [
      '-i',
      '--rm',
      '--memory', `${this.dockerMem}MB`,
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.peerPort}:${this.peerPort}`,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
    ];

    let heimdallArgs = [
      '-i',
      '--rm',
      '--memory', `${this.heimdallDockerMem}MB`,
      '--cpus', this.heimdallDockerCPUs.toString(10),
      '--name', this.polygonGenerateHeimdallDockerName(),
      '--network', this.dockerNetwork,
      '-v', `${heimdallStartScriptPath}:/start.sh`,
      '-p', `${this.heimdallPeerPort}:${this.heimdallPeerPort}`,
    ];

    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    await fs.ensureDir(dataDir);
    const configDir = this.configDir || path.join(tmpdir, 'config');
    await fs.ensureDir(configDir);

    // bor directories
    const borDataDir = path.join(dataDir, 'bor');
    const borDBDir = path.join(borDataDir, 'data');
    await fs.ensureDir(borDataDir);
    await fs.ensureDir(borDBDir);
    const borConfigDir = path.join(configDir, 'bor');
    const borConfigConfigDir = path.join(borConfigDir, 'config');
    await fs.ensureDir(borConfigDir);
    await fs.ensureDir(borConfigConfigDir);

    const borConfigPath = path.join(borConfigConfigDir, Polygon.fileName.config);
    const borGenesisPath = path.join(borConfigConfigDir, Polygon.fileName.genesis);

    borArgs = [...borArgs,
      '-v', `${borDBDir}:${containerDataDir}`,
      '-v', `${borConfigConfigDir}:${containerConfigDir}`,
    ];

    // heimdall directories
    const heimdallDataDir = path.join(dataDir, 'heimdall');
    const heimdallDBDir = path.join(heimdallDataDir, 'data');
    await fs.ensureDir(heimdallDataDir);
    await fs.ensureDir(heimdallDBDir);
    const heimdallConfigDir = path.join(configDir, 'heimdall');
    const heimdallConfigConfigDir = path.join(heimdallConfigDir, 'config');
    await fs.ensureDir(heimdallConfigDir);
    await fs.ensureDir(heimdallConfigConfigDir);

    heimdallArgs = [...heimdallArgs,
      '-v', `${heimdallDBDir}:${containerHeimdallDataDir}`,
      '-v', `${heimdallConfigConfigDir}:${containerHeimdallConfigDir}`,
    ];

    const heimdallConfigPath = path.join(heimdallConfigConfigDir, Polygon.fileName.heimdallConfig);
    const heimdallServerConfigPath = path.join(heimdallConfigConfigDir, Polygon.fileName.heimdallServerConfig);
    const heimdallGenesisPath = path.join(heimdallConfigConfigDir, Polygon.fileName.genesis);

    const configExists = await fs.pathExists(heimdallConfigPath);

    await this._docker.pull(this.heimdallDockerImage, str => this._logOutput(str));
    await this._docker.pull(this.dockerImage, str => this._logOutput(str));

    if(!configExists) {
      await new Promise((resolve, reject) => {
        this._docker.run(
          this.heimdallDockerImage + ` heimdalld init --chain-id ${Polygon.getHeimdallChainId(this.network)}`,
          heimdallArgs,
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
      await fs.writeFile(heimdallConfigPath, this.polygonGenerateHeimdallConfig(), 'utf8');
      await fs.writeFile(heimdallServerConfigPath, this.polygonGenerateHeimdallServerConfig(), 'utf8');
      await fs.writeFile(heimdallGenesisPath, this.polygonGenerateHeimdallGenesis(), 'utf8');
    }

    const borConfigExists = await fs.pathExists(borConfigPath);
    if(!borConfigExists) {
      await fs.writeFile(borGenesisPath, this.polygonGenerateBorGenesis(), 'utf8');
      await fs.writeFile(borConfigPath, this.generateConfig(), 'utf8');

    }
    const borDir = path.join(borDBDir, 'bor');
    const borDataExists = await pathExists(borDir);
    if(!borDataExists) {
      await new Promise((resolve, reject) => {
        this._docker.run(
          this.dockerImage + ` bor --config=${versionData.configDir}/${Polygon.fileName.config} init ${versionData.configDir}/${Polygon.fileName.genesis}`,
          borArgs,
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
    }

    return {
      heimdallArgs,
      borArgs,
    };
  }

  startHeimdall(versionData: PolygonVersionDockerImage, heimdallArgs: string[]): ChildProcess {
    return this._docker.run(
      this.heimdallDockerImage + versionData.generateHeimdallRuntimeArgs(this),
      heimdallArgs,
      output => this._logOutput('heimdall - ' + output),
      err => this._logError(err),
      code => this._logClose(code),
    );
  }

  startBor(versionData: PolygonVersionDockerImage, borArgs: string[]): ChildProcess {
    return this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      borArgs,
      output => this._logOutput('bor - ' + output),
      err => this._logError(err),
      code => this._logClose(code),
    );
  }

  async stop(): Promise<void> {
    await Promise.all([
      this.stopBor(),
      this.stopHeimdall(),
    ]);
  }

  async stopHeimdall(): Promise<string|undefined> {
    try {
      const name = this.polygonGenerateHeimdallDockerName();
      const success = await this._docker.stop(name);
      await timeout(1000);
      return success;
    } catch(err) {
      this._logError(err);
    }
  }

  async stopBor(): Promise<string|undefined> {
    try {
      const name = this.id;
      const success = await this._docker.stop(name);
      await timeout(1000);
      return success;
    } catch(err) {
      this._logError(err);
    }
  }

  toObject(): PolygonCryptoNodeData {
    return {
      ...this._toObject(),
      heimdallDockerImage: this.heimdallDockerImage,
      heimdallDockerCPUs: this.heimdallDockerCPUs,
      heimdallDockerMem: this.heimdallDockerMem,
      heimdallPeerPort: this.heimdallPeerPort,
      heimdallRPCPort: this.heimdallRPCPort,
    };
  }

  generateConfig(): string {
    return Polygon.generateConfig(this);
  }

  polygonGenerateHeimdallConfig(): string {
    return Polygon.generateHeimdallConfig(this.id, this.peerPort, this.network);
  }

  polygonGenerateHeimdallServerConfig(): string {
    return Polygon.generateHeimdallServerConfig(this.id, this.rpcPort);
  }

  polygonGenerateBorGenesis(): string {
    const { network } = this;
    switch(network) {
      case NetworkType.MAINNET:
        return genesis.borMainnet;
      case NetworkType.TESTNET:
        return genesis.borTestnet;
      default:
        return '';
    }
  }

  polygonGenerateHeimdallGenesis(): string {
    const { network } = this;
    switch(network) {
      case NetworkType.MAINNET:
        return genesis.heimdallMainnet;
      case NetworkType.TESTNET:
        return genesis.heimdallTestnet;
      default:
        return '';
    }
  }

  polygonGenerateHeimdallDockerName(): string {
    return Polygon.generateHeimdallDockerName(this.id);
  }

  async rpcGetVersion(): Promise<string> {
    let borVersion: string;
    try {
      borVersion = await this.rpcGetBorVersion();
    } catch(err) {
      borVersion = '';
    }
    let heimdallVersion: string;
    try {
      heimdallVersion = await this.rpcGetHeimdallVersion();
    } catch(err) {
      heimdallVersion = '';
    }
    const joinedVersion = `${heimdallVersion}/${borVersion}`;
    return joinedVersion === '/' ? '' : joinedVersion;
  }

  async rpcGetBorVersion(): Promise<string> {
    return this._rpcGetVersion();
  }

  async rpcGetHeimdallVersion(): Promise<string> {
    try {
      const version: string = await new Promise((resolve, reject) => {
        let res = '';
        this._docker.exec(
          this.polygonGenerateHeimdallDockerName(),
          [],
          'heimdalld version',
          output => {
            res += output;
          }, err => {
            reject(err);
          },
          () => {
            resolve(res);
          });
      });
      const trimmedVersion = version.trim();
      return /^\d+\.\d+\.\d+/.test(trimmedVersion) ? trimmedVersion : '';
    } catch(err) {
      return '';
    }
  }

  async rpcGetBlockCount(): Promise<string> {
    let borBlockCount: string;
    try {
      borBlockCount = await this.rpcGetBorBlockCount();
    } catch(err) {
      borBlockCount = '';
    }
    let heimdallBlockCount: string;
    try {
      heimdallBlockCount = await this.rpcGetHeimdallBlockCount();
    } catch(err) {
      heimdallBlockCount = '';
    }
    const joinedBlockCount = `${heimdallBlockCount}/${borBlockCount}`;
    return joinedBlockCount === '/' ? '' : joinedBlockCount;
  }

  async rpcGetBorBlockCount(): Promise<string> {
    return this._rpcGetBlockCount();
  }

  async rpcGetHeimdallBlockCount(): Promise<string> {
    const { blockCount = '' } = await this.rpcGetHeimdallStatus();
    return blockCount;
  }

  async rpcGetHeimdallStatus(): Promise<{syncing?: boolean, blockCount?: string}> {
    try {
      const statusJson: string = await new Promise((resolve, reject) => {
        let res = '';
        this._docker.exec(
          this.polygonGenerateHeimdallDockerName(),
          [],
          'curl -s http://localhost:26657/status',
          output => {
            res += output;
          }, err => {
            reject(err);
          },
          () => {
            resolve(res);
          });
      });
      const status = JSON.parse(statusJson.trim());
      const syncing: boolean = status.result.sync_info.catching_up;
      const blockCount: string = status.result.sync_info.latest_block_height;
      return {
        syncing,
        blockCount,
      };
    } catch(err) {
      return {};
    }
  }

}
