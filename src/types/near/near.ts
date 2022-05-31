import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import path from 'path';
import os from 'os';
import { Bitcoin } from '../bitcoin/bitcoin';
import { filterVersionsByNetworkType, timeout } from '../../util';
import { FS } from '../../util/fs';
import * as coreConfig from './config/core';

// const coreConfig = `
// [Eth]
// NetworkId = 1

// [Node]
// DataDir = "/root/.near"
// KeyStoreDir = "/root/keystore"
// HTTPHost = "0.0.0.0"
// HTTPPort = {{RPC_PORT}}
// HTTPVirtualHosts = ["*"]
// HTTPModules = ["net", "web3", "eth"]

// [Node.P2P]
// ListenAddr = ":{{PEER_PORT}}"
// `;

export class Near extends Bitcoin {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Near.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '1.26.0',
            clientVersion: '1.26.0',
            image: 'nearprotocol/nearcore:1.26.0',
            dataDir: '/srv/near/data',
            walletDir: '/srv/near/keystore',
            configDir: '/srv/near',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` /usr/local/bin/run.sh`;//neard --home ~/.near init --chain-id testnet --download-genesis --download-config


              //`;// --config=${path.join(this.configDir, Near.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
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
  ];

  static roles = [
    Role.NODE,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 3030,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 24567,
  };

  static defaultCPUs = 8;

  static defaultMem = 16384;

  static generateConfig(client = Near.clients[0], network = NetworkType.MAINNET, peerPort = Near.defaultPeerPort[NetworkType.MAINNET], rpcPort = Near.defaultRPCPort[NetworkType.MAINNET]): string {
    switch(client) {
      case NodeClient.CORE:
        return coreConfig.mainnet
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .trim();
      default:
        return '';
    }
  }

  static configName(data: CryptoNodeData): string {
    return 'config.json';
  }

  id: string;
  ticker = 'near';
  name = 'Near';
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
  dockerCPUs = Near.defaultCPUs;
  dockerMem = Near.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  //configDir = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  role = Near.roles[0];

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Near.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Near.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Near.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.walletDir;
    //this.configDir = data.configDir || this.configDir;
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Near.versions(this.client, this.network);
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

  async start(): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = Near.versions(this.client, this.network);
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
        '-p', `${this.rpcPort}:${this.rpcPort}`,
        '-p', `${this.peerPort}:${this.peerPort}`,
        '-e', 'INIT=1',
      ];
      // const tmpdir = os.tmpdir();
      // const dataDir = this.dataDir || path.join(tmpdir, uuid());
      // args = [...args, '-v', `${dataDir}:${containerDataDir}`];
      // await fs.ensureDir(dataDir);

      // const walletDir = this.walletDir || path.join(tmpdir, uuid());
      // args = [...args, '-v', `${walletDir}:${containerWalletDir}`];
      // await fs.ensureDir(walletDir);

      // const configDir = this.configDir || path.join(tmpdir, uuid());
      // await fs.ensureDir(configDir);
      // const configPath = path.join(configDir, Near.configName(this));
      // const configExists = await fs.pathExists(configPath);
      // if(!configExists)
      //   await fs.writeFile(configPath, this.generateConfig(), 'utf8');
      // args = [...args, '-v', `${configDir}:${containerConfigDir}`];

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

  generateConfig(): string {
    return Near.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }
}
//   async _rpcGetVersion(): Promise<string> {
//     try {
//       this._runCheck('rpcGetVersion');
//       const { body } = await request
//         .post(this.endpoint())
//         .set('Accept', 'application/json')
//         .auth(this.rpcUsername, this.rpcPassword)
//         .timeout(this._requestTimeout)
//         .send({
//           id: '',
//           jsonrpc: '2.0',
//           method: 'web3_clientVersion',
//           params: [],
//         });
//       const { result = '' } = body;
//       // first, check for RC matches
//       let matches = result.match(/v(\d+\.\d+\.\d+-rc.+?)-/i);
//       if(!matches)
//         // check for regular matches
//         matches = result.match(/v(\d+\.\d+\.\d+)/);
//       if(matches && matches.length > 1) {
//         return matches[1];
//       } else {
//         return '';
//       }
//     } catch(err) {
//       this._logError(err);
//       return '';
//     }
//   }

//   async rpcGetVersion(): Promise<string> {
//     return this._rpcGetVersion();
//   }

//   async _rpcGetBlockCount(): Promise<string> {
//     let blockHeight;
//     try {
//       this._runCheck('rpcGetBlockCount');
//       const res = await request
//         .post(this.endpoint())
//         .set('Accept', 'application/json')
//         .timeout(this._requestTimeout)
//         .send({
//           id: '',
//           jsonrpc: '2.0',
//           method: 'eth_syncing',
//           params: [],
//         });
//       if(res.body.result === false) {
//         const res = await request
//           .post(this.endpoint())
//           .set('Accept', 'application/json')
//           .timeout(this._requestTimeout)
//           .send({
//             id: '',
//             jsonrpc: '2.0',
//             method: 'eth_blockNumber',
//             params: [],
//           });
//         const currentBlock = res.body.result;
//         const blockNum = parseInt(currentBlock, 16);
//         blockHeight = blockNum > 0 ? blockNum.toString(10) : '';
//       } else {
//         const { currentBlock } = res.body.result;
//         const blockNum = parseInt(currentBlock, 16);
//         blockHeight = blockNum > 0 ? blockNum.toString(10) : '';
//       }
//     } catch(err) {
//       this._logError(err);
//       blockHeight = '';
//     }
//     return blockHeight || '';
//   }

//   async rpcGetBlockCount(): Promise<string> {
//     return this._rpcGetBlockCount();
//   }

//   _makeSyncingCall(): Promise<any> {
//     return request
//       .post(this.endpoint())
//       .set('Accept', 'application/json')
//       .timeout(this._requestTimeout)
//       .send({
//         id: '',
//         jsonrpc: '2.0',
//         method: 'eth_syncing',
//         params: [],
//       });
//   }

//   async _getStatus(): Promise<string> {
//     let status;
//     try {
//       if(this.remote) {
//         const version = await this.rpcGetVersion();
//         status = version ? Status.RUNNING : Status.STOPPED;
//       } else {
//         const stats = await this._docker.containerInspect(this.id);
//         status = stats && stats.State.Running ? Status.RUNNING : Status.STOPPED;
//       }
//     } catch(err) {
//       status = Status.STOPPED;
//     }

//     if(status !== Status.STOPPED) {
//       try {
//         const res = await this._makeSyncingCall();
//         if(res.body.result !== false)
//           status = Status.SYNCING;
//       } catch(err) {
//         // do nothing with the error
//       }
//     }

//     return status;
//   }

//   async getStatus(): Promise<string> {
//     return this._getStatus();
//   }

// }
