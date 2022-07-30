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


interface HarmonyNodeData extends CryptoNodeData {
  shard: number
  publicKey: string
  privateKeyEncrypted: string
  //accountName: string
  address: string
  domain: string
  passwordPath: string
};

interface HarmonyVersionDockerImage extends VersionDockerImage {
  //mylocalaccountname: string
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
            version: '4.3.9',
            clientVersion: '4.3.9',
            image: 'icculp/harmony:4.3.9',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: HarmonyNodeData): string {
              console.log(path.join(this.configDir, Harmony.configName(data)));
              return ` /bin/harmony -c ${path.join(this.configDir, Harmony.configName(data))}`;
            },
            // generateBLSKeys(data: HarmonyNodeData): string {
            //   return `./hmy -c ${path.join(this.configDir, Harmony.configName(data))}`;
            // },
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
              return `/harmony/harmony -c ${path.join(this.configDir, Harmony.configName(data))}`;
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
            walletDir: '/root/.hmy_cli/account-keys',
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
    let address = '';
    let shard = 0;
    let role = '';
    if(typeof client !== 'string') { // node was passed in rather than client string
      const node = client;
      client = node.client;
      network = node.network;
      peerPort = node.peerPort;
      rpcPort = node.rpcPort;
      address = node.address;
      shard = node.shard
      role = node.role;
      // if(node.role === Role.VALIDATOR)
      //   baseConfig = coreValidatorConfig;
    }
    switch(client) {
      case NodeClient.CORE:
        return coreConfig._252
          .replace('{{NETWORK}}', network === NetworkType.MAINNET ? 'mainnet' : 'testnet')
          .replace(/{{NETWORK_TYPE}}/g, network === NetworkType.MAINNET ? 't' : 'p')
          .replace('{{NODE_TYPE}}', role === Role.NODE ? 'explorer' : 'validator')
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
      passwordPath: this.passwordPath,
      privateKeyEncrypted: this.privateKeyEncrypted,
      publicKey: this.publicKey,
    };
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
      //`--restart=on-failure:${this.restartAttempts}`,
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
      '-p', `${this.peerPort}:${this.peerPort}`,
      //'-i',
      //'--rm',
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
      const configPath = path.join(configDir, Harmony.configName(this));
      const configExists = await fs.pathExists(configPath);
      if(this.role === Role.VALIDATOR && !password) {
        throw new Error('You must pass in a password the first time you run start() on a validator. This password will be used to generate the key pair.');
      } else if(this.role === Role.VALIDATOR && password && !this.privateKeyEncrypted) {
        console.log('GENERATING THE PASSWORD BITCH 314');
        await this.generateKeyPair(password);
      }
      
      args = [...args, '-v', `${configDir}:${containerConfigDir}`];

      if (!configExists){
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');
        console.log("Writing config");
        console.log(configPath);
      }

      await this._docker.pull(this.dockerImage, str => this._logOutput(str));

      if(this.role === Role.VALIDATOR && password) {
        console.log('MADE IT TO VALIDATORRRR');
        const passwordPath = this.passwordPath || path.join(tmpdir, uuid());
        const passwordFileExists = await fs.pathExists(passwordPath);
        if(!passwordFileExists)
          console.log(password);
          console.log(passwordPath);
          await fs.writeFile(passwordPath, password, 'utf8');
        args = [...args, '-v', `${passwordPath}:${containerPasswordPath}`];
        if((await fs.readdir(walletDir)).length === 0) {
          console.log('MAKING DA WALLETS 335');
          const keyFilePath = path.join(os.tmpdir(), uuid());
          await fs.ensureDir(keyFilePath);
          //await fs.writeFile(this.walletDir + accountPath, this.privateKeyEncrypted, 'utf8');
          console.log('we made dem wallets ');
          const accountPath = `/UTC--${new Date().toISOString().replace(/:/g, '-')}--${this.address}.json`;
          await fs.writeFile(this.walletDir + accountPath, this.privateKeyEncrypted, 'utf8');
          //await fs.copy(path.join(dataDir, 'node_key.json'), path.join(walletDir, 'node_key.json'));
          let newArgs = [
            //...args,
            //'-i',
            '-u', 'root',
            '--rm',
            '-v', `${passwordPath}:${containerPasswordPath}`,
            '-v', `${this.walletDir}/blskeys:/harmony`,  
          ];
          // newArgs = newArgs.filter(item => item !== `${configDir}:${containerConfigDir}`);

          console.log(newArgs);
          await new Promise<void>(resolve => {
            this._docker.run(
              this.dockerImage + ` /bin/hmy keys generate-bls-keys --count 1 -v --passphrase-file ${containerPasswordPath} `,//` ./hmy keys import-ks /root/keystore${accountPath}  --passphrase-file ${containerPasswordPath}`,
              newArgs,
              output => this._logOutput(output),
              err => this._logError(err),
              () => resolve(),
            );
          });


          // create validator node here.
          //
          //


          console.log("Import should be done");
          //await fs.remove(keyFilePath + '/hmy');
          //await fs.remove(keyFilePath + '/harmony');
          //await fs._fs.copySync(keyFilePath, walletDir + '/blskeys');
          //await fs.remove(keyFilePath);
          // for above? ./hmy keys import-ks <PATH_TO_KEYSTORE_JSON>


          
        // else 
        }
      }

      // --bls.pass                  enable BLS key decryption with passphrase (default true)
      // --bls.pass.file string      the pass file used for BLS decryption. If specified, this pass file will be used for all BLS keys
      // --bls.pass.save             after input the BLS passphrase from console, whether to persist the input passphrases in .pass file
      // --bls.pass.src string       source for BLS passphrase (auto, file, prompt) (default "auto")

      // Create BLS key if < 1 keys in dir
      // need to add pass to *.pass file in same dir for each key (bls.key, bls.pass)
      // sep func to add/create new keys for later
      // ./hmy keys generate-bls-keys --count 1 --shard 1 --passphrase
      // move keys to .hmy/blskeys or change dir in config.json
      // echo '[replace_with_your_passphrase]' > .hmy/blskeys/[replace_with_BLS_without_.key].pass
      const keyPath = path.join(configDir, 'node_key.json');
      const keyExists = await fs.pathExists(keyPath);
      args = [
        ...args,
        `--rm`,
      ];
      //if(!keyExists){
        console.log("Running this mufa");
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
    if(exitCode !== 0){
      console.log(args);
      console.log('----');
      console.log(versionData.generateRuntimeArgs(this));
      throw new Error(`Docker run for ${this.id} with ${this.dockerImage} failed with exit code ${exitCode}`);
    }
      //}
    };//};};

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


  // generateBLS(): {
  //     await new Promise<void>(resolve => {
  //       this._docker.run(
  //         this.dockerImage + `./hmy keys generate-bls-keys /root/keystore/blskeys`,
  //         [...newArgs, '-i', '--rm'],
  //         output => this._logOutput(output),
  //         err => this._logError(err),
  //         () => resolve(),
  //       );
  //     });
  //     // await timeout(1000);
  //     // await fs.copy(path.join(dataDir, 'validator_key.json'), path.join(walletDir, 'validator_key.json'));
  //     // await fs.copy(path.join(dataDir, 'node_key.json'), path.join(walletDir, 'node_key.json'));
  //     // await fs.writeFile(path.join(configDir, 'config.json'), this.generateConfig(), 'utf8');
  //   }

  //   const exitCode = await new Promise<number>((resolve, reject) => {
  //     this._docker.run(
  //       this.dockerImage + versionData.generateRuntimeArgs(this),
  //       [...args, 
  //       output => this._logOutput(output),
  //       err => {
  //         this._logError(err);
  //         reject(err);
  //       },
  //       code => {
  //         resolve(code);
  //       },
  //     );
  //   });
  // }

  generateConfig(): string {
    return Harmony.generateConfig(this);
  }

  async generateKeyPair(password: string): Promise<boolean> {
    try {
      const web3 = new Web3();
      const { address, privateKey } = web3.eth.accounts.create();
      this.address = address;
      this.privateKeyEncrypted = JSON.stringify(web3.eth.accounts.encrypt(privateKey, password));
      return true;
    } catch(err) {
      this._logError(err);
      return false;
    }
  }

  async getRawPrivateKey(password: string): Promise<string> {
    try {
      const web3 = new Web3(`http://localhost:${this.rpcPort}`);
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
