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
import Web3 from 'web3';
import * as coreConfig from './config/core';
import { Account } from '@harmony-js/account';


interface HarmonyNodeData extends CryptoNodeData {
  shard: number
  publicKey: string
  privateKeyEncrypted: string
  address: string
  domain: string
  bech32Address: string
  blskeys: string[]
}

interface HarmonyVersionDockerImage extends VersionDockerImage {}

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
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName())}`;
            },
          },
          {
            version: '4.3.9',
            clientVersion: '4.3.9',
            image: 'harmony/harmony:4.3.9',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName())}`;
            },
          },
          {
            version: '4.3.4',
            clientVersion: '4.3.4',
            image: 'rburgett/harmony:4.3.4',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName())}`;
            },
          },
          {
            version: '4.3.2',
            clientVersion: '4.3.2',
            image: 'pocketfoundation/harmony:4.3.2-29-g1c450bbc',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName())}`;
            },
          },
          {
            version: '4.3.1',
            clientVersion: '4.3.1',
            image: 'pocketfoundation/harmony:4.3.1',
            dataDir: '/root/data',
            walletDir: '/root/.hmy_cli/account-keys',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName())}`;
            },
          },
          {
            version: '4.3.0',
            clientVersion: '4.3.0',
            image: 'pocketfoundation/harmony:4.3.0',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/harmony/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              return ` -c ${path.join(this.configDir, Harmony.configName())}`;
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
    Role.VALIDATOR,
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

  static generateConfig(client: string|Harmony = Harmony.clients[0], network = NetworkType.MAINNET, peerPort = Harmony.defaultPeerPort[NetworkType.MAINNET], rpcPort = Harmony.defaultRPCPort[NetworkType.MAINNET]): string {
    let shard = 0;
    let version = '';
    let config = '';
    let role = Role.NODE;
    if(typeof client !== 'string') { // node was passed in rather than client string
      const node = client;
      client = node.client;
      network = node.network;
      peerPort = node.peerPort;
      rpcPort = node.rpcPort;
      shard = node.shard;
      version = node.version;
      role = node.role;
    }
    switch(client) {
      case NodeClient.CORE:
        if (version == '4.3.9') {
          config = coreConfig._252;
        } else if (version == '4.3.12') {
          config = coreConfig._255;
        } else {
          config = coreConfig._250;
        }
        return config
          .replace('{{NETWORK}}', network === NetworkType.MAINNET ? 'mainnet' : 'devnet')
          .replace(/{{NETWORK_TYPE}}/g, network === NetworkType.MAINNET ? 't' : 'ps')
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .replace('{{SHARD}}', shard.toString(10))
          .replace('{{NO_STAKING}}', role === Role.VALIDATOR ? 'false' : 'true')
          .replace('{{NODE_TYPE}}', role === Role.VALIDATOR ? 'validator' : 'explorer')
          .replace('{{SAVE_PASSPHRASE}}', role === Role.VALIDATOR ? 'true' : 'false')
          .trim();
      default:
        return '';
    }
  }

  static configName(): string {
    return 'harmony.conf';
  }

  static passwordFileName(): string {
    return 'pass.pwd';
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
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  shard = 0;
  role = Harmony.roles[0];
  publicKey = '';
  privateKeyEncrypted = '';
  address = '';
  bech32Address = '';
  domain = '';
  blskeys: string[] = [];

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
    this.blskeys = data.blskeys || this.blskeys;
    this.address = data.address || this.address;
    this.publicKey = data.publicKey || this.publicKey;
    this.privateKeyEncrypted = data.privateKeyEncrypted || this.privateKeyEncrypted;
    this.domain = data.domain || this.domain;

    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  toObject(): HarmonyNodeData {
    return {
      ...this._toObject(),
      shard: this.shard,
      domain: this.domain,
      address: this.address,
      privateKeyEncrypted: this.privateKeyEncrypted,
      publicKey: this.publicKey,
      bech32Address: this.bech32Address,
      blskeys: this.blskeys,
    };
  }

  async start(password?: string): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = Harmony.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown ${this.ticker} version ${this.version}`);

    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);

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
    args = [...args, '-v', `${configDir}:${containerConfigDir}`];
    await fs.ensureDir(configDir);

    if(!running) {
      const configPath = path.join(configDir, Harmony.configName());
      const configExists = await fs.pathExists(configPath);

      if (!configExists) {
        const config = this.generateConfig();
        await fs.writeFile(configPath, config, 'utf8');
        // console.log(config);
      }

      await this._docker.pull(this.dockerImage, str => this._logOutput(str));

      if(this.role === Role.VALIDATOR && !password) {
        throw new Error('You must pass in a password the first time you run start() on a validator. This password will be used to generate the key pair.');
      } else if(this.role === Role.VALIDATOR && password) {
        const blsPath = path.join(this.walletDir, 'blskeys');
        await fs.ensureDir(blsPath);
        await this.generateKeyPair(password); // will generate new or read from privatekey
        const passwordPath = this.harmonyPasswordPath();
        const passwordFileExists = await fs.pathExists(passwordPath);
        if(!passwordFileExists) {
          await fs.writeFile(passwordPath, password, 'utf8');
        }
        if((await fs.readdir(walletDir)).length === 0) {
          // const keyFilePath = path.join(os.tmpdir(), uuid());
          // await fs.ensureDir(keyFilePath);
          const accountFile = `UTC--${new Date().toISOString().replace(/:/g, '-')}--${this.address}.json`;
          await fs.writeFile(path.join(this.walletDir, accountFile), this.privateKeyEncrypted, 'utf8');
        }
        const blskeys: string[] = [];

        if (this.blskeys.length == 0) {
          const files = await fs.readdir(path.join(this.walletDir, 'blskeys'));
          let keyname = '';
          for(const file of files) {
            if (file.includes('.key')) {
              keyname = file.split('.key', 1)[0];
              blskeys.push(keyname);
            }
          }
          this.blskeys = blskeys;
        }
      }
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

  harmonyPasswordPath(): string {
    return path.join(this.configDir, Harmony.passwordFileName());
  }

  generateConfig(): string {
    return Harmony.generateConfig(this);
  }

  async stakeValidator(amount: string, password: string, domain: string,
                      contact: string, name: string = this.id, identity: string = this.id,
                      details: string = this.id, blsCount = 1,
                      ): Promise<string> {
    const fs = this._fs;
    const versions = Harmony.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const containerPasswordPath = path.join(versionData.configDir, Harmony.passwordFileName());
    const passwordPath = this.harmonyPasswordPath();
    await this._fs.writeFile(passwordPath, password, 'utf8');
    await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);

    const blsArgs = [
      '-i',
      '--rm',
      '-v', `${passwordPath}:${containerPasswordPath}`,
      '-v', `${this.walletDir}/blskeys:/harmony`,
    ];
    await new Promise<void>(resolve => {
      this._docker.run(
        this.dockerImage + ` /bin/hmy keys generate-bls-keys --count ${blsCount} -v --passphrase-file ${containerPasswordPath} `,
        blsArgs,
        output => this._logOutput(output),
        err => this._logError(err),
        () => resolve(),
      );
    });
    const blsPath = path.join(this.walletDir, 'blskeys');
    const blskeys: string[] = [];
    const files = await fs.readdir(blsPath);
    let keyname = '';
    for(const file of files) {
      if (file.includes('.key')) {
        keyname = file.split('.key', 1)[0];
        await fs.writeFile(path.join(blsPath, keyname + '.pass'), password, 'utf8');
        blskeys.push(keyname);
      }
    }
    this.blskeys = blskeys;
    const configPath = path.join(this.configDir, Harmony.configName());
    const configfile = await this._fs.readFile(configPath, 'utf8');
    await this._fs.writeFile(configPath, configfile.replace('explorer', 'validator'), 'utf8');
    const net = this.network === NetworkType.MAINNET ? 't' : 'ps';
    const createValidator = ` --node=https://api.s0.${net}.hmny.io staking create-validator ` +
        `--bls-pubkeys-dir /root/.hmy_cli/account-keys/nodelauncher/blskeys ` +
        `--validator-addr ${this.bech32Address} --amount ${amount} ` +
        `--bls-pubkeys ${this.blskeys.join(',')} ` +
        `--name "${name}"  --identity "${identity}" --details "${details}" ` +
        `--security-contact "${contact}" --website "${domain}" ` +
        `--max-change-rate 0.1 --max-rate 0.1 --rate 0.1 --gas-price 100 ` +
        `--max-total-delegation 100000000 --min-self-delegation 10000 --passphrase-file ${containerPasswordPath} `;
    //const txPatt = /[0-9a-f]{64}/i; // look into
    let outputStr = '';
    await this._docker.stop(this.id);
    const args = [
      '-i',
      '--rm',
      '-v', `${passwordPath}:${containerPasswordPath}`,
      '-v', `${this.walletDir}:/root/.hmy_cli/account-keys/nodelauncher`,
    ];
    await new Promise<void>((resolve, reject) => {
      this._docker.run(
        this.dockerImage + ' /bin/hmy -v' + createValidator,
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
    //const match = outputStr.match(txPatt);
    return outputStr;//match ? match[0] : '';
  }

  async generateKeyPair(password: string): Promise<boolean> {
    try {
      const web3 = new Web3();
      if (!this.privateKeyEncrypted){
        const { address, privateKey } = web3.eth.accounts.create();
        this.privateKeyEncrypted = JSON.stringify(web3.eth.accounts.encrypt(privateKey, password));
      }
      const harmonyAccount = new Account();
      const account = await harmonyAccount.fromFile(this.privateKeyEncrypted, password);
      this.bech32Address = account.bech32Address;
      this.address = account.checksumAddress;
      this.publicKey = account.publicKey || '';
      console.log("One Address: " + this.bech32Address);
      console.log("Hex Address: " + this.address);
      return true;
    } catch(err) {
      this._logError(err);
      return false;
    }
  }

  async getRawPrivateKey(password: string): Promise<string> {
    try {
      const web3 = new Web3();
      const account = web3.eth.accounts.decrypt(JSON.parse(this.privateKeyEncrypted), password);
      return account.privateKey;
    } catch(err) {
      return '';
    }
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
