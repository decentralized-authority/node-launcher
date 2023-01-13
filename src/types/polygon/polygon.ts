import { EthereumPreMerge } from '../shared/ethereum-pre-merge';
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
import isString from 'lodash/isString';

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

export class Polygon extends EthereumPreMerge {

  static versions(client: string, networkType: string): PolygonVersionDockerImage[] {
    client = client || Polygon.clients[0];
    let versions: PolygonVersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '0.3.3',
            clientVersion: '0.3.3',
            image: '0xpolygon/bor:0.3.3',
            dataDir: '/var/lib/bor/data',
            walletDir: '/var/lib/bor/keys',
            configDir: '/var/lib/bor/config',
            heimdallImage: '0xpolygon/heimdall:0.3.0',
            heimdallDataDir: '/var/lib/heimdall/data',
            heimdallWalletDir: '/var/lib/heimdall/keys',
            heimdallConfigDir: '/var/lib/heimdall/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              // return ` bor -config=${this.configDir}/${Polygon.fileName.config} -chain=mainnet -bor.heimdall http://${Polygon.generateHeimdallDockerName(id)}:1317 --pprof --pprof.port 7071 --pprof.addr 0.0.0.0`;
              return ` server -config=${this.configDir}/${Polygon.fileName.config}`;
            },
            generateHeimdallRuntimeArgs(data: CryptoNodeData): string {
              return ` start --home=/var/lib/heimdall --chain ${data.network === NetworkType.TESTNET ? 'mumbai' : 'mainnet'} --rest-server`;
            },
          },
          {
            version: '0.2.17',
            clientVersion: '0.2.17',
            image: 'maticnetwork/bor:v0.2.17',
            dataDir: '/root/data',
            walletDir: '/root/keys',
            configDir: '/root/config',
            heimdallImage: 'maticnetwork/heimdall:v0.2.10',
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
          {
            version: '0.2.16',
            clientVersion: '0.2.16',
            image: 'maticnetwork/bor:v0.2.16',
            dataDir: '/root/data',
            walletDir: '/root/keys',
            configDir: '/root/config',
            heimdallImage: 'maticnetwork/heimdall:v0.2.10',
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
          {
            version: '0.2.14',
            clientVersion: '0.2.14',
            image: 'maticnetwork/bor:v0.2.14',
            dataDir: '/root/data',
            walletDir: '/root/keys',
            configDir: '/root/config',
            heimdallImage: 'maticnetwork/heimdall:v0.2.8',
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

  static generateConfig(client: Polygon|string = Polygon.clients[0], network = NetworkType.MAINNET, peerPort = Polygon.defaultPeerPort[NetworkType.MAINNET], rpcPort = Polygon.defaultRPCPort[NetworkType.MAINNET], id = ''): string {
    let clientStr: string;
    if(typeof client === 'string') {
      clientStr = client;
    } else {
      clientStr = client.client;
      network = client.network || network;
      peerPort = client.peerPort || peerPort;
      rpcPort = client.rpcPort || rpcPort;
      id = client.id || id;
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
      bootstrapNodes = '"enode://0cb82b395094ee4a2915e9714894627de9ed8498fb881cec6db7c65e8b9a5bd7f2f25cc84e71e89d0947e51c76e85d0847de848c7782b13c0255247a6758178c@44.232.55.71:30303", "enode://88116f4295f5a31538ae409e4d44ad40d22e44ee9342869e7d68bdec55b0f83c1530355ce8b41fbec0928a7d75a5745d528450d30aec92066ab6ba1ee351d710@159.203.9.164:30303", "enode://3178257cd1e1ab8f95eeb7cc45e28b6047a0432b2f9412cff1db9bb31426eac30edeb81fedc30b7cd3059f0902b5350f75d1b376d2c632e1b375af0553813e6f@35.221.13.28:30303", "enode://16d9a28eadbd247a09ff53b7b1f22231f6deaf10b86d4b23924023aea49bfdd51465b36d79d29be46a5497a96151a1a1ea448f8a8666266284e004306b2afb6e@35.199.4.13:30303"';
    } else if(network === NetworkType.TESTNET) {
      bootstrapNodes = '"enode://320553cda00dfc003f499a3ce9598029f364fbb3ed1222fdc20a94d97dcc4d8ba0cd0bfa996579dcc6d17a534741fb0a5da303a90579431259150de66b597251@54.147.31.250:30303", "enode://095c4465fe509bd7107bbf421aea0d3ad4d4bfc3ff8f9fdc86f4f950892ae3bbc3e5c715343c4cf60c1c06e088e621d6f1b43ab9130ae56c2cacfd356a284ee4@18.213.200.99:30303", "enode://90676138b9823f4b834dd4fb2f95da9f54730a74ff9deb4782c4be98232f1797806a62375d9b6d305af49f7c0be69a9adcad7eb533091bd15b77dd5997b256e2@54.227.107.44:30303"';
    } else {
      bootstrapNodes = '';
    }
    return baseConfig
      .replace(/{{IDENTITY}}/, !isString(client) ? client.id : 'bor-node')
      .replace(/{{BOOTSTRAP_NODES}}/, bootstrapNodes)
      .replace(/{{RPC_PORT}}/, rpcPort.toString(10))
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10))
      .replace(/{{CHAIN}}/, network === NetworkType.TESTNET ? 'mumbai' : 'mainnet')
      .replace(/{{HEIMDALL_URL}}/, `http://${Polygon.generateHeimdallDockerName(id)}:1317`);
  }

  static generateHeimdallConfig(id: string, peerPort: number, network: string): string {
    let seeds: string;
    switch(network) {
      case NetworkType.MAINNET:
        seeds = 'f4f605d60b8ffaaf15240564e58a81103510631c@159.203.9.164:26656,4fb1bc820088764a564d4f66bba1963d47d82329@44.232.55.71:26656,2eadba4be3ce47ac8db0a3538cb923b57b41c927@35.199.4.13:26656,3b23b20017a6f348d329c102ddc0088f0a10a444@35.221.13.28:26656,25f5f65a09c56e9f1d2d90618aa70cd358aa68da@35.230.116.151:26656';
        break;
      case NetworkType.TESTNET:
        seeds = '4cd60c1d76e44b05f7dfd8bab3f447b119e87042@54.147.31.250:26656,9dfc12d9f39257cefc3d57a4d7302586e59a994e@18.213.200.99:26656,b18bbe1f3d8576f4b73d9b18976e71c65e839149@34.226.134.117:26656,7a6c7b5d25b13ce3448b047dbebeb1a19cc2e092@18.213.200.99:26656';
        break;
      default:
        seeds = '';
    }
    return coreConfig.heimdallConfig
      .replace(/{{MONIKER}}/, id)
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10))
      .replace(/{{SEEDS}}/, seeds);
  }

  static generateHeimdallServerConfig(borName: string, borRPCPort: number, network: string): string {
    return coreConfig.heimdallServerConfig
      .replace(/{{BOR_NAME}}/, borName)
      .replace(/{{BOR_RPC_PORT}}/, borRPCPort.toString(10))
      .replace(/{{CHAIN}}/g, network === NetworkType.TESTNET ? 'mumbai' : 'mainnet');
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

  static async upgradeNode(node: PolygonCryptoNodeData, versionData: PolygonVersionDockerImage): Promise<boolean> {
    const {
      version: origVersion,
      clientVersion: origClientVersion,
      dockerImage: origDockerImage,
      heimdallDockerImage: origHeimdallDockerImage,
    } = node;
    node.version = versionData.version;
    node.clientVersion = versionData.clientVersion;
    node.dockerImage = versionData.image;
    if(versionData.heimdallImage)
      node.heimdallDockerImage = versionData.heimdallImage;
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
        node.heimdallDockerImage = origHeimdallDockerImage;
        if(upgradeErr)
          throw upgradeErr;
        else
          return false;
      }
    }
    return true;
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

  isV2(): boolean {
    const splitVersion = this.version.split('.');
    return splitVersion[1] === '2';
  }

  async start(): Promise<ChildProcess[]> {

    const versions = Polygon.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);

    let heimdallRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.polygonGenerateHeimdallDockerName());
    let borRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);

    let heimdallArgs: string[] = [];
    let borArgs: string[] = [];
    if(!heimdallRunning || !borRunning) {

      if(heimdallRunning || borRunning) {
        await this.stop();
        heimdallRunning = false;
        borRunning = false;
      }

      const res = await this.prestart(versionData);
      heimdallArgs = res.heimdallArgs;
      borArgs = res.borArgs;

    }
    if(!heimdallRunning) {
      const exitCode = await this.startHeimdall(versionData, heimdallArgs);
      if(exitCode !== 0)
        throw new Error(`Docker run for ${this.id} with ${this.heimdallDockerImage} failed with exit code ${exitCode}`);
    }

    const heimdallInstance = this._docker.attach(
      this.polygonGenerateHeimdallDockerName(),
      output => this._logOutput('heimdall - ' + output),
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );

    if(!borRunning) {
      const exitCode = await this.startBor(versionData, borArgs);
      if(exitCode !== 0)
        throw new Error(`Docker run for ${this.id} with ${this.dockerImage} failed with exit code ${exitCode}`);
    }

    const borInstance = this._docker.attach(
      this.id,
      output => this._logOutput('bor - ' + output),
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );

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

    const isV2 = this.isV2();

    let borArgs = [
      '--memory', `${this.dockerMem}MB`,
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.peerPort}:${this.peerPort}/tcp`,
      '-p', `${this.peerPort}:${this.peerPort}/udp`,
      '-p', `${this.rpcPort}:${this.rpcPort}/tcp`,
    ];

    let heimdallArgs = [
      '--memory', `${this.heimdallDockerMem}MB`,
      '--cpus', this.heimdallDockerCPUs.toString(10),
      '--name', this.polygonGenerateHeimdallDockerName(),
      '--network', this.dockerNetwork,
      '-p', `${this.heimdallPeerPort}:${this.heimdallPeerPort}/tcp`,
    ];

    if(isV2) {
      const heimdallStartScriptPath = path.join(tmpdir, uuid());
      const heimdallStartScript = 'heimdalld start & heimdalld rest-server';
      await fs.writeFile(heimdallStartScriptPath, heimdallStartScript, 'utf8');
      heimdallArgs = [
        ...heimdallArgs,
        '-v', `${heimdallStartScriptPath}:/start.sh`,
      ];
    }

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
          this.heimdallDockerImage + ` init --home=/var/lib/heimdall --chain ${this.network === NetworkType.TESTNET ? 'mumbai' : 'mainnet'}`,
          [
            ...heimdallArgs,
            '-i',
            '--rm',
          ],
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

    return {
      heimdallArgs,
      borArgs,
    };
  }

  startHeimdall(versionData: PolygonVersionDockerImage, heimdallArgs: string[]): Promise<number> {
    const isV2 = this.isV2();
    let args = [
      ...heimdallArgs,
      '-d',
      `--restart=on-failure:${this.restartAttempts}`,
    ];
    if(isV2) {
      args = [
        ...args,
        '--entrypoint', '/bin/sh',
      ];
    }
    return new Promise<number>((resolve, reject) => {
      this._docker.run(
        this.heimdallDockerImage + versionData.generateHeimdallRuntimeArgs(this),
        args,
        output => this._logOutput('heimdall - ' + output),
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

  startBor(versionData: PolygonVersionDockerImage, borArgs: string[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._docker.run(
        this.dockerImage + versionData.generateRuntimeArgs(this),
        [
          ...borArgs,
          '-d',
          `--restart=on-failure:${this.restartAttempts}`,
        ],
        output => this._logOutput('bor - ' + output),
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

  async stop(): Promise<void> {
    await Promise.all([
      this.stopBor(),
      this.stopHeimdall(),
    ]);
  }

  async stopHeimdall(): Promise<void> {
    try {
      const name = this.polygonGenerateHeimdallDockerName();
      await this._docker.stop(name);
      await this._docker.rm(name);
      await timeout(1000);
    } catch(err) {
      this._logError(err);
    }
  }

  async stopBor(): Promise<void> {
    try {
      const name = this.id;
      await this._docker.stop(name);
      await this._docker.rm(name);
      await timeout(1000);
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
    return Polygon.generateHeimdallServerConfig(this.id, this.rpcPort, this.network);
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
