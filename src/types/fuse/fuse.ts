/* eslint @typescript-eslint/require-await: 1 */

import { Ethereum } from '../ethereum/ethereum';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { v4 as uuid } from 'uuid';
import { CryptoNodeData, ValidatorInfo, VersionDockerImage } from '../../interfaces/crypto-node';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import { filterVersionsByNetworkType, timeout } from '../../util';
import Web3 from 'web3';
import { FS } from '../../util/fs';

interface FuseNodeData extends CryptoNodeData {
  publicKey: string
  privateKeyEncrypted: string
  address: string
  domain: string
  passwordPath: string
}

const testnetBootnodes = [
  'enode://aaa92938fb3b4b073ea811894376d597a3feef30ce999a8bee617c24b7acd4021f16f94856e5c48f25b4fde999fc5df27de73d2c394e6c46cc5d44e012dd9e35@3.123.228.59:30303',
  'enode://e44c9e9f12b5a1e1e44b3fa4fb77b7aae2e8484cd13ad742d7f67fda9a4fa627bac5e418580fcaf98c267b747a3b9d5f19fdeb13804ac08b267aeb77489b3c5d@18.192.23.151:30303',
  'enode://ad46ec3c252bc76fb150865382b2dfbfa98ae9156a4b4659fca43b08799b8ec97d1b0a9d70aeccb26e5045853a63807cfc96e68b57cdbe1242aa12c66914f1d4@3.125.120.73:30303',
  'enode://5ff7f084a3f5e091d1264639d74e5d8e65204fcdf4d727a37d140758709da744ab44d348a8b23010946a378a7d76f46b922b9a727027a154b71a2cc596adf5f8@170.75.251.230:30303',
].join(',');

const coreConfig = `
[parity]
chain = "/home/parity/.local/share/io.parity.ethereum/spec.json"
db_path = "/root/data"
keys_path = "/root/keystore"

[rpc]
cors = ["all"]
port = {{RPC_PORT}}
interface = "all"
hosts = ["all"]
apis = ["web3", "eth", "net", "parity", "traces", "rpc", "secretstore"]

[websockets]
disable = true

[network]
port = {{PEER_PORT}}
reserved_peers="/home/parity/.local/share/io.parity.ethereum/bootnodes.txt"
`;
const coreValidatorConfig = `
[parity]
chain = "/home/parity/.local/share/io.parity.ethereum/spec.json"
db_path = "/root/data"
keys_path = "/root/keystore"

[rpc]
cors = ["all"]
port = {{RPC_PORT}}
interface = "all"
hosts = ["all"]
apis = ["web3", "eth", "net", "parity", "traces", "rpc", "secretstore"]

[websockets]
disable = true

[network]
port = {{PEER_PORT}}
reserved_peers="/home/parity/.local/share/io.parity.ethereum/bootnodes.txt"

[account]
password = ["/root/pass.pwd"]

[mining]
reseal_on_txs = "none"
force_sealing = true
engine_signer = "{{address}}"
min_gas_price = 1000000000
gas_floor_target = "10000000"
`;

interface FuseVersionDockerImage extends VersionDockerImage {
  passwordPath: string
  imageValidatorApp: string
  imageNetstat: string
}

export class Fuse extends Ethereum {

  static versions(client: string, networkType: string): FuseVersionDockerImage[] {
    client = client || Fuse.clients[0];
    let versions: FuseVersionDockerImage[];
    switch(client) {
      case NodeClient.OPEN_ETHEREUM:
        versions = [
          {
            version: '2.0.2',
            clientVersion: '3.2.6',
            image: 'fusenet/spark-node:2.0.2',
            imageValidatorApp: 'fusenet/spark-validator-app:1.0.0',
            imageNetstat: 'fusenet/spark-netstat:1.0.0',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: FuseNodeData): string {
              return ` --no-warp --config=${path.join(this.configDir, Fuse.configName(data))}`;
            },
          },
          {
            version: '2.0.1',
            clientVersion: '3.2.6',
            image: 'fusenet/spark-node:2.0.1_OE',
            imageValidatorApp: '',
            imageNetstat: '',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: FuseNodeData): string {
              return ` --no-warp --config=${path.join(this.configDir, Fuse.configName(data))} --bootnodes ${testnetBootnodes}`;
            },
          },
          {
            version: '2.0.1',
            clientVersion: '3.2.6',
            image: 'fusenet/node:2.0.1',
            imageValidatorApp: '',
            imageNetstat: '',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: FuseNodeData): string {
              return ` --no-warp --config=${path.join(this.configDir, Fuse.configName(data))}`;
            },
          },
          {
            version: '2.5.13',
            clientVersion: '2.5.13',
            image: 'fusenet/node:1.0.0',
            imageValidatorApp: '',
            imageNetstat: '',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            passwordPath: '/root/pass.pwd',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: FuseNodeData): string {
              return ` --config=${path.join(this.configDir, Fuse.configName(data))}`;
            },
          },
        ];
        break;
      default:
        versions = [];
    }
    return filterVersionsByNetworkType(networkType, versions) as FuseVersionDockerImage[];
  }

  static clients = [
    NodeClient.OPEN_ETHEREUM,
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
    [NetworkType.MAINNET]: 8545,
    [NetworkType.TESTNET]: 8545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 30300,
    [NetworkType.TESTNET]: 30300,
  };

  static defaultCPUs = 6;

  static defaultMem = 8192;

  static generateConfig(client: string|Fuse = Fuse.clients[0], network = NetworkType.MAINNET, peerPort = Fuse.defaultPeerPort[NetworkType.MAINNET], rpcPort = Fuse.defaultRPCPort[NetworkType.MAINNET]): string {
    let baseConfig = coreConfig;
    let address = '';
    if(typeof client !== 'string') { // node was passed in rather than client string
      const node = client;
      client = node.client;
      network = node.network;
      peerPort = node.peerPort;
      rpcPort = node.rpcPort;
      address = node.address;
      if(node.role === Role.VALIDATOR)
        baseConfig = coreValidatorConfig;
    }
    switch(client) {
      case NodeClient.OPEN_ETHEREUM:
        return baseConfig
          .replace('{{address}}', address)
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace(/{{RPC_PORT}}/g, rpcPort.toString(10))
          .trim();
      case NodeClient.PARITY:
        return baseConfig
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace(/{{RPC_PORT}}/g, rpcPort.toString(10))
          .trim();
      default:
        return '';
    }
  }

  static configName(data: FuseNodeData): string {
    return 'config.toml';
  }

  id: string;
  ticker = 'fuse';
  name = 'Fuse';
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
  dockerCPUs = Fuse.defaultCPUs;
  dockerMem = Fuse.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  passwordPath = '';
  publicKey = '';
  privateKeyEncrypted = '';
  address = '';
  role = Fuse.roles[0];
  domain = '';

  constructor(data: FuseNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Fuse.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Fuse.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Fuse.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configDir = data.configDir || this.configDir;
    this.passwordPath = data.passwordPath || this.passwordPath;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Fuse.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    this.address = data.address || this.address;
    this.publicKey = data.publicKey || this.publicKey;
    this.privateKeyEncrypted = data.privateKeyEncrypted || this.privateKeyEncrypted;
    this.domain = data.domain || this.domain;
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  toObject(): FuseNodeData {
    return {
      ...this._toObject(),
      domain: this.domain,
      address: this.address,
      privateKeyEncrypted: this.privateKeyEncrypted,
      publicKey: this.publicKey,
      passwordPath: this.passwordPath,
    };
  }

  async start(password?: string): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = Fuse.versions(this.client, this.network);
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
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
      '-p', `${this.peerPort}:${this.peerPort}/tcp`,
      '-p', `${this.peerPort}:${this.peerPort}/udp`,
      '--entrypoint', '/usr/local/bin/parity',
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

      await Promise.all([
        this._docker.pull(this.dockerImage, str => this._logOutput(str)),
        this._docker.pull(versionData.imageValidatorApp, str => this._logOutput(str)),
        this._docker.pull(versionData.imageNetstat, str => this._logOutput(str)),
      ]);

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
          await new Promise<void>(resolve => {
            this._docker.run(
              this.dockerImage + ` account import ${accountPath}${versionData.generateRuntimeArgs(this)}`,
              newArgs,
              output => this._logOutput(output),
              err => this._logError(err),
              () => resolve(),
            );
          });
          await fs.remove(keyFilePath);
        }
      }

      args = [
        ...args,
        '-d',
        `--restart=on-failure:${this.restartAttempts}`,
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

    if (this.role === Role.VALIDATOR) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // start validator app
      const validatorAppName = this.validatorAppContainerName();
      const validatorAppRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(validatorAppName);
      if(!validatorAppRunning) {
        try {
          if (!validatorAppRunning) {
            const validatorAppArgs = [
              '-d',
              `--restart=on-failure:${this.restartAttempts}`,
              '--memory', '250m',
              '-v', `${path.resolve(walletDir, '..')}:/config`,
              '-e', 'CONFIG_DIR=/config',
              '-e', `RPC=http://${this.id}:${this.rpcPort}`,
              '--network', this.dockerNetwork,
              '--name', validatorAppName,
            ];
            this._docker.run(
              versionData.imageValidatorApp,
              validatorAppArgs,
              () => {
              },
              err => this._logError(err),
              exitCode => this._logOutput(`${this.validatorAppContainerName()} exited with status code ${exitCode}`),
            );
          }
        } catch (err) {
          this._logError(err);
        }
      }
      // start netstats
      const netstatConfig = `
          [
            {
              "name"              : "netstat_daemon",
              "script"            : "app.js",
              "log_date_format"   : "YYYY-MM-DD HH:mm Z",
              "merge_logs"        : false,
              "watch"             : false,
              "max_restarts"      : 100,
              "exec_interpreter"  : "node",
              "exec_mode"         : "fork_mode",
              "env":
              {
                "NODE_ENV"        : "production",
                "INSTANCE_NAME"   : "",
                "BRIDGE_VERSION"  : "",
                "ROLE"            : "",
                "FUSE_APP_VERSION": "",
                "PARITY_VERSION"  : "",
                "NETSTATS_VERSION": "",
                "CONTACT_DETAILS" : "",
                "WS_SECRET"       : "see http://forum.ethereum.org/discussion/2112/how-to-add-yourself-to-the-stats-dashboard-its-not-automatic",
                "WS_SERVER"       : "https://health.fuse.io",
                "VERBOSITY"       : 2
              }
            }
          ]`;
      const netstatConfigPath = path.join(tmpdir, uuid());
      await fs.writeJson(netstatConfigPath, JSON.parse(netstatConfig), {spaces: 2});
      try {
        const netstatName = this.netstatContainerName();
        const netstatRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(netstatName);
        if(!netstatRunning) {
          const netstatArgs = [
            '-d',
            `--restart=on-failure:${this.restartAttempts}`,
            '--memory', '250m',
            '--name', netstatName,
            '--network', this.dockerNetwork,
            '--user', 'root',
            '-e', `RPC_HOST=${this.id}`,
            '-e', `RPC_PORT=${this.rpcPort}`,
            '-e', `LISTENING_PORT=${this.peerPort}`,
            '-v', `${netstatConfigPath}:/home/ethnetintel/eth-net-intelligence-api/app.json.example`,
          ];
          this._docker.run(
            `${versionData.imageNetstat} --instance-name ${this.address} --role validator --parity-version ${versionData.version} --fuseapp-version ${versionData.imageValidatorApp.split(':')[1]} --netstats-version ${versionData.imageNetstat.split(':')[1]}`,
            netstatArgs,
            () => {
            },
            err => this._logError(err),
            () => this._logOutput(`${this.netstatContainerName()} closed`),
          );
        }
      } catch (err) {
        this._logError(err);
      }
    }

    this._instance = instance;
    this._instances = [
      instance,
    ];
    return this.instances();
  }

  validatorAppContainerName(): string {
    return `${this.id}-validator-app`;
  }

  netstatContainerName(): string {
    return `${this.id}-netstat`;
  }

  async stop(): Promise<void> {
    if(this.role === Role.VALIDATOR) {
      for(const name of [this.validatorAppContainerName(), this.netstatContainerName()]) {
        try {
          await this._docker.kill(name);
          await this._docker.rm(name);
        } catch(err) {
          this._logError(err);
        }
      }
    }
    try {
      await this._docker.stop(this.id);
      await this._docker.rm(this.id);
      await timeout(1000);
    } catch(err) {
      this._logError(err);
    }
  }

  generateConfig(): string {
    return Fuse.generateConfig(this);
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

  async rpcGetBalance(): Promise<string> {
    try {
      const web3 = new Web3(`http://localhost:${this.rpcPort}`);
      return await web3.eth.getBalance(this.address);
    } catch(err) {
      return '';
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

  async stakeValidator(amount: string, password: string): Promise<string> {
    try {
      const web3 = new Web3(`http://localhost:${this.rpcPort}`);
      const account = web3.eth.accounts.decrypt(JSON.parse(this.privateKeyEncrypted), password);
      web3.eth.accounts.wallet.add(account);
      let to: string;
      switch(this.network) {
        case NetworkType.MAINNET:
          to = '0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79';
          break;
        case NetworkType.TESTNET:
          to = '0xC8c3a332f9e4CE6bfFFcf967026cB006Db2311c7';
          break;
        default:
          throw new Error(`Unable to stake for network ${this.network}`);
      }
      const data = {
        from: this.address,
        to,
        value: web3.utils.toWei(amount),
        gasPrice:'1000000000',
        gas:'1000000',
      };
      const { transactionHash } = await web3.eth.sendTransaction(data);
      return transactionHash;
    } catch(err) {
      this._logError(err);
      throw err;
    }
  }

  async getValidatorInfo(): Promise<ValidatorInfo|null> {
    try {
      const web3 = new Web3(`http://localhost:${this.rpcPort}`);
      // need to do full implementation
      return null;
    } catch(err) {
      this._logError(err);
      return null;
    }
  }

}
