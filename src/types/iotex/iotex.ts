import { Ethereum } from '../ethereum/ethereum';
import * as coreConfig from './config/core';
import * as genesis from './config/genesis';
import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { filterVersionsByNetworkType, timeout } from '../../util';
import { Docker } from '../../util/docker';
import { v4 as uuid } from 'uuid';
import { FS } from '../../util/fs';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';

export class IOTEX extends Ethereum {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || IOTEX.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '1.7.0',
            clientVersion: '1.7.0',
            image: 'iotex/iotex-core:v1.7.0',
            dataDir: '/var/data',
            walletDir: '/var/keys',
            configDir: '/etc/iotex',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ' iotex-server -config-path=/etc/iotex/config.yaml -genesis-path=/etc/iotex/genesis.yaml -plugin=gateway';
            },
          },
          {
            version: '1.6.4',
            clientVersion: '1.6.4',
            image: 'iotex/iotex-core:v1.6.4',
            dataDir: '/var/data',
            walletDir: '/var/keys',
            configDir: '/etc/iotex',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ' iotex-server -config-path=/etc/iotex/config.yaml -genesis-path=/etc/iotex/genesis.yaml -plugin=gateway';
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
    [NetworkType.MAINNET]: 8545,
    [NetworkType.TESTNET]: 9545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 4689,
    [NetworkType.TESTNET]: 4690,
  };

  static defaultCPUs = 8;

  static defaultMem = 16384;

  static generateConfig(client = IOTEX.clients[0], network = NetworkType.MAINNET, peerPort = IOTEX.defaultPeerPort[NetworkType.MAINNET], rpcPort = IOTEX.defaultRPCPort[NetworkType.MAINNET]): string {
    let baseConfig: string;
    switch(client) {
      case NodeClient.CORE:
        if(network === NetworkType.TESTNET) {
          baseConfig = coreConfig.testnet;
        } else if(network === NetworkType.MAINNET) {
          baseConfig = coreConfig.mainnet;
        } else {
          baseConfig =  '';
        }
        break;
      default:
        baseConfig = '';
    }
    return baseConfig
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10));
  }

  static configName(data: CryptoNodeData): string {
    return 'config.yaml';
  }

  static fileName = {
    config: 'config.yaml',
    genesis: 'genesis.yaml',
    dbPatch: 'trie.db.patch',
  };

  id: string;
  ticker = 'iotex';
  name = 'IoTeX';
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
  dockerCPUs = IOTEX.defaultCPUs;
  dockerMem = IOTEX.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || IOTEX.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || IOTEX.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || IOTEX.clients[0];
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
    const versions = IOTEX.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  iotexGenerateCoreDockerName(): string {
    return this.id + '-core';
  }

  iotexGenerateRedisDockerName(): string {
    return this.id + '-redis';
  }

  async start(): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = IOTEX.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);

    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    const dbDir = path.join(dataDir, 'data');
    const logDir = path.join(dataDir, 'log');
    const redisDir = path.join(dataDir, 'redis');
    const coreDockerName = this.iotexGenerateCoreDockerName();
    const redisImage = 'redis:6.2.4-alpine3.14';
    const babelImage = 'jrpc1/iotex-babel-api:latest';

    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(coreDockerName);

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
        '--name', coreDockerName,
        '--network', this.dockerNetwork,
        '-p', `${this.peerPort}:${this.peerPort}`,
      ];
      await fs.ensureDir(dataDir);
      await fs.ensureDir(dbDir);
      await fs.ensureDir(logDir);
      await fs.ensureDir(redisDir);

      args = [...args,
        '-v', `${dbDir}:${containerDataDir}`,
        '-v', `${logDir}:/var/log`,
      ];

      const walletDir = this.walletDir || path.join(tmpdir, uuid());
      args = [...args, '-v', `${walletDir}:${containerWalletDir}`];
      await fs.ensureDir(walletDir);

      const configDir = this.configDir || path.join(tmpdir, uuid());
      await fs.ensureDir(configDir);
      const configPath = path.join(configDir, IOTEX.fileName.config);
      const configExists = await fs.pathExists(configPath);
      if (!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');
      args = [...args, '-v', `${configPath}:${path.join(containerConfigDir, IOTEX.fileName.config)}`];

      const genesisPath = path.join(configDir, IOTEX.fileName.genesis);
      const genesisExists = await fs.pathExists(genesisPath);
      if (!genesisExists)
        await fs.writeFile(genesisPath, this.generateGenesis(), 'utf8');
      args = [...args, '-v', `${genesisPath}:${path.join(containerConfigDir, IOTEX.fileName.genesis)}`];

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
      if (exitCode !== 0)
        throw new Error(`Docker run for ${this.id} with ${this.dockerImage} failed with exit code ${exitCode}`);
    }
    const instance = this._docker.attach(
      coreDockerName,
      output => this._logOutput(output),
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );

    const redisPort = 6379;
    const redisDockerName = this.iotexGenerateRedisDockerName();

    const redisContainerRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.iotexGenerateRedisDockerName());
    if(!redisContainerRunning) {

      await this._docker.pull(redisImage, str => this._logOutput(str));
      const exitCode = await new Promise<number>((resolve, reject) => {
        this._docker.run(
          redisImage,
          [
            '-d',
            `--restart=on-failure:${this.restartAttempts}`,
            '--name', redisDockerName,
            '--network', this.dockerNetwork,
            '-v', `${redisDir}:/data`,
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
      if (exitCode !== 0)
        throw new Error(`Docker run for ${this.id} with ${redisImage} failed with exit code ${exitCode}`);
    }

    const redisInstance = this._docker.attach(
      redisDockerName,
      undefined,
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );

    const babelContainerRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);
    if(!babelContainerRunning) {
      await timeout(1000);
      await this._docker.pull(babelImage, str => this._logOutput(str));
      const exitCode = await new Promise<number>((resolve, reject) => {
        this._docker.run(
          babelImage + ' npm start',
          [
            '-d',
            `--restart=on-failure:${this.restartAttempts}`,
            '--name', this.id,
            '--network', this.dockerNetwork,
            '-p', `${this.rpcPort}:${this.rpcPort}`,
            '-e', `PORT=${this.rpcPort}`,
            '-e', `CHAIN_ID=${this.network === NetworkType.TESTNET ? '4690' : '4689'}`,
            '-e', `END_POINT=http://${coreDockerName}:14014`,
            '-e', `REDIS_HOST=${redisDockerName}`,
            '-e', `REDIS_PORT=${redisPort}`,
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
      if (exitCode !== 0)
        throw new Error(`Docker run for ${this.id} with ${babelImage} failed with exit code ${exitCode}`);
    }
    const babelInstance = this._docker.attach(
      this.id,
      undefined,
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
      redisInstance,
      babelInstance,
    ];

    return this.instances();
  }

  async stop(): Promise<void> {
    const containers = [
      `${this.id}`,
      this.iotexGenerateRedisDockerName(),
      this.iotexGenerateCoreDockerName(),
    ];
    for(const name of containers) {
      try {
        await this._docker.stop(name);
        await this._docker.rm(name);
      } catch(err) {
        this._logError(err);
      }
    }
    await timeout(1000);
  }

  generateConfig(): string {
    return IOTEX.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

  generateGenesis(): string {
    const { network } = this;
    switch(network) {
      case NetworkType.MAINNET:
        return genesis.mainnet;
      case NetworkType.TESTNET:
        return genesis.testnet;
      default:
        return '';
    }
  }

}
