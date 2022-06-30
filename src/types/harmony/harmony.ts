import { Ethereum } from '../ethereum/ethereum';
import { CryptoNodeData, ValidatorInfo, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { Docker } from '../../util/docker';
import { v4 as uuid } from 'uuid';
import { filterVersionsByNetworkType } from '../../util';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import request from 'superagent';
import { FS } from '../../util/fs';
import * as coreConfig from './config/core';


interface HarmonyNodeData extends CryptoNodeData {
  shard: number
  publicKey: string
  privateKeyEncrypted: string
  accountName: string
  address: string
  domain: string
  passwordPath: string
};

interface HarmonyVersionDockerImage extends VersionDockerImage {
  mylocalaccountname: string
  passwordPath: string
};

export class Harmony extends Ethereum {

  static versions(client: string, networkType: string): HarmonyVersionDockerImage[] {
    client = client || Harmony.clients[0];
    let versions: HarmonyVersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '4.3.12',
            clientVersion: '4.3.12',
            image: 'rburgett/harmony:4.3.12',
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
            version: '4.3.9',
            clientVersion: '4.3.9',
            image: 'rburgett/harmony:4.3.9',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
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
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
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
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
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
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
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
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName(data))}`;
            },
          },
        ];
        break;
      default:
        versions = [];
    }
    return filterVersionsByNetworkType(networkType, versions) as HarmonyVersionDockerImage[];
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
    [NetworkType.MAINNET]: 9500,
    [NetworkType.TESTNET]: 9500,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 9000,
    [NetworkType.TESTNET]: 9000,
  };

  static defaultCPUs = 8;

  static defaultMem = 32768;

  static generateConfig(client: string|Harmony = Harmony.clients[0], network = NetworkType.MAINNET, peerPort = Harmony.defaultPeerPort[NetworkType.MAINNET], rpcPort = Harmony.defaultRPCPort[NetworkType.MAINNET], shard = 0): string {
    
    switch(client) {
      case NodeClient.CORE:
        return coreConfig._252
          .replace('{{NETWORK}}', network === NetworkType.MAINNET ? 'mainnet' : 'testnet')
          .replace(/{{NETWORK_TYPE}}/g, network === NetworkType.MAINNET ? 't' : 'p')
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .replace('{{SHARD}}', shard.toString(10))
          .trim();
      default:
        return '';
    }
  }

  static configName(data: HarmonyNodeData): string {
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
  passwordPath = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  shard = 0;
  role = Harmony.roles[0];
  publicKey = '';
  privateKeyEncrypted = '';
  address = '';
  domain = '';

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
    this.passwordPath = data.passwordPath || this.passwordPath;
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
  
    toObject(): HarmonyNodeData {
      return {
        ...this._toObject(),
        shard: this.shard,
        domain: this.domain,
        address: this.address,
        passwordPath: this.passwordPath,
        privateKeyEncrypted: this.privateKeyEncrypted,
        publicKey: this.publicKey,
      };
    }

    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  async start(password?: string): Promise<ChildProcess[]> {
    const fs = this._fs;
    // const versionData = Harmony.versions(this.client, this.network).find(({ version }) => version === this.version);
    const versions = Harmony.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown ${this.ticker} version ${this.version}`);

    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);

    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configDir: containerConfigDir,
      passwordPath: containerPasswordPath,
    } = versionData;
    
    let args = [
      '-d',
      `--restart=on-failure:${this.restartAttempts}`,
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

    if(!running) {
      const configPath = path.join(configDir, Fuse.configName(this));
      const configExists = await fs.pathExists(configPath);
      if(this.role === Role.VALIDATOR && !password) {
        throw new Error('You must pass in a password the first time you run start() on a validator. This password will be used to generate the key pair.');
      } else if(this.role === Role.VALIDATOR && password && !this.privateKeyEncrypted) {
        await this.generateKeyPair(password);
      }
      if (!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');
      args = [...args, '-v', `${configDir}:${containerConfigDir}`];

      await this._docker.pull(this.dockerImage, str => this._logOutput(str));

      if(this.role === Role.VALIDATOR && password) {
        const passwordPath = this.passwordPath || path.join(tmpdir, uuid());
        const passwordFileExists = await fs.pathExists(passwordPath);
        if(!passwordFileExists)
          await fs.writeFile(passwordPath, password, 'utf8');
        args = [...args, '-v', `${passwordPath}:${containerPasswordPath}`];
        if((await fs.readdir(walletDir)).length === 0) {
          const keyFilePath = path.join(os.tmpdir(), uuid());
          await fs.writeFile(keyFilePath, this.privateKeyEncrypted, 'utf8');
          const accountPath = `/UTC--${new Date().toISOString().replace(/:/g, '-')}--${this.address}.json`;
          const newArgs = [
            ...args,
            '-i',
            '--rm',
            '-v', `${keyFilePath}:${accountPath}`,
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
