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
import { coreConfig } from './config/core';
import { POKT } from '../../index';

interface PocketValidatorInfo extends ValidatorInfo {
  chains: string[];
}

export interface PocketAccount {
  address: string
  privateKeyEncrypted: string
  publicKey: string
}

interface PocketNodeData extends CryptoNodeData {
  publicKey: string
  privateKeyEncrypted: string
  address: string
  domain: string
  accounts: PocketAccount[]
}

export class Pocket extends Bitcoin {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Pocket.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
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
      case NodeClient.LEAN_POKT:
        versions = [
          {
            version: 'BETA-0.9.2',
            clientVersion: 'BETA-0.9.2',
            image: 'rburgett/pocketcore:lean',
            dataDir: '/root/pocket-data',
            walletDir: '/root/pocket-keys',
            configDir: '/root/.pocket/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` start --${network.toLowerCase()} --forceSetValidators`;
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
    NodeClient.LEAN_POKT,
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
    [NetworkType.MAINNET]: '03b74fa3c68356bb40d58ecc10129479b159a145@seed1.mainnet.pokt.network:20656,64c91701ea98440bc3674fdb9a99311461cdfd6f@seed2.mainnet.pokt.network:21656,0057ee693f3ce332c4ffcb499ede024c586ae37b@seed3.mainnet.pokt.network:22856,9fd99b89947c6af57cd0269ad01ecb99960177cd@seed4.mainnet.pokt.network:23856,f2a4d0ec9d50ea61db18452d191687c899c3ca42@seed5.mainnet.pokt.network:24856,f2a9705924e8d0e11fed60484da2c3d22f7daba8@seed6.mainnet.pokt.network:25856,582177fd65dd03806eeaa2e21c9049e653672c7e@seed7.mainnet.pokt.network:26856,2ea0b13ab823986cfb44292add51ce8677b899ad@seed8.mainnet.pokt.network:27856,a5f4a4cd88db9fd5def1574a0bffef3c6f354a76@seed9.mainnet.pokt.network:28856,d4039bd71d48def9f9f61f670c098b8956e52a08@seed10.mainnet.pokt.network:29856,5c133f07ed296bb9e21e3e42d5f26e0f7d2b2832@poktseed100.chainflow.io:26656,361b1936d3fbe516628ebd6a503920fc4fc0f6a7@seed.pokt.rivet.cloud:26656',
    [NetworkType.TESTNET]: '3487f08b9e915f347eb4372b406326ffbf13d82c@testnet-seed-1.nodes.pokt.network:4301,27f4295d1407d9512a25d7f2ea91d1a415660c16@testnet-seed-2.nodes.pokt.network:4302,0beb1a93fe9ce2a3b058b98614f1ed0f5ad664d5@testnet-seed-3.nodes.pokt.network:4303,8fd656162dbbe0402f3cef111d3ad8d2723eef8e@testnet-seed-4.nodes.pokt.network:4304,80100476b67fea2e94c6b2f72e40cf8f6062ed21@testnet-seed-5.nodes.pokt.network:4305,370edf0882e094e83d4087d5f8801bbf24f5d931@testnet-seed-6.nodes.pokt.network:4306,57aff5a049846d14e2dcc06fdcc241d7ebe6a3eb@testnet-seed-7.nodes.pokt.network:4307,545fb484643cf2efbcf01ee2b7bc793ef275cd84@testnet-seed-8.nodes.pokt.network:4308',
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
      } case NodeClient.LEAN_POKT: {
        const config = JSON.parse(POKT.generateConfig(NodeClient.CORE, network, peerPort, rpcPort, domain));
        config.pocket_config.lean_pocket = true;
        config.pocket_config.lean_pocket_user_key_file = '../../run/secrets/node_keys.json';
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
  accounts: PocketAccount[];

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
    if(data.accounts && data.accounts.length > 0) {
      this.accounts = data.accounts;
    } else if(this.privateKeyEncrypted) {
      this.accounts = [
        {
          address: this.address,
          privateKeyEncrypted: this.privateKeyEncrypted,
          publicKey: this.publicKey,
        },
      ];
    } else {
      this.accounts = [];
    }

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
      accounts: this.accounts,
    };
  }

  async start(password?: string, simulateRelay = false): Promise<ChildProcess[]> {
    const { accounts, client } = this;
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
        const privValStatePath = path.join(walletDir, 'priv_val_state.json');
        await fs.writeJson(privValStatePath, {
          height: '0',
          round: '0',
          step: 0,
        }, {spaces: 2});
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

      let secrets: {[key: string]: {file: string}} = {};

      const secretsDir = await getSecretsDir(this.id);
      const nodeKeyFileName = 'node_key.json';
      const nodeKeySecretPath = path.join(secretsDir, nodeKeyFileName);
      const privValKeyFileName = 'priv_val_key.json';
      const privValKeySecretPath = path.join(secretsDir, privValKeyFileName);
      const nodeKeysFileName = 'node_keys.json';
      const nodeKeysSecretPath = path.join(secretsDir, nodeKeysFileName);

      if(!password) {
        const nodeKeyFileExists = await fs.pathExists(nodeKeySecretPath);
        const privValKeyFileExists = await fs.pathExists(privValKeySecretPath);
        if(!nodeKeyFileExists || !privValKeyFileExists)
          throw new Error('Password must be sent into start() method on first run in order to unlock the node.');
      } else if(client === NodeClient.LEAN_POKT) {
        const privateKey = await this.getRawPrivateKey(password);
        await fs.writeJson(
          nodeKeysSecretPath,
          [{priv_key: privateKey}],
          {spaces: 2});
        secrets = {
          [nodeKeysFileName]: {
            file: nodeKeysSecretPath,
          },
        };
      } else {
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
        secrets = {
          [nodeKeyFileName]: {
            file: nodeKeySecretPath,
          },
          [privValKeyFileName]: {
            file: privValKeySecretPath,
          },
        };
      }

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
              `${this.rpcPort}:${this.rpcPort}`,
              `${this.peerPort}:${this.peerPort}`,
            ],
            volumes: [
              `${configDir}:${containerConfigDir}`,
              `${dataDir}:${containerDataDir}`,
              `${walletDir}:${containerWalletDir}`,
            ],
            entrypoint: [
              'pocket',
              ...versionData.generateRuntimeArgs(this).trim().split(/\s+/),
            ],
            secrets: Object.keys(secrets),
            restart: `on-failure:${this.restartAttempts}`,
          },
        },
        networks: {
          [this.dockerNetwork]: {
            driver: 'bridge',
          },
        },
        secrets,
      };

      const composeConfigPath = path.join('/', 'tmp', uuid());
      await fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});

      const args = [
        '-d',
        '--remove-orphans',
      ];
      const exitCode = await new Promise<number>((resolve, reject) => {
        this._docker.composeUp(
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
    const command = `nodes stake custodial ${this.address} ${amount} ${chains.join(',')} https://${this.domain}:443 ${this.network.toLowerCase()} ${fee} ${this.network !== NetworkType.TESTNET} --pwd ${password}`;
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
          const poktAccount = {
            privateKeyEncrypted: ppk,
            address: account.addressHex,
            publicKey: account.publicKey.toString('hex'),
          };
          Object.assign(this, poktAccount);
          this.accounts.push(poktAccount);
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
