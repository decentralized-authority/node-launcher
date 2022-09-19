import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import path from 'path';
import os from 'os';
import { Bitcoin } from '../bitcoin/bitcoin';
import { filterVersionsByNetworkType, splitVersion, timeout } from '../../util';
import { FS } from '../../util/fs';
import { base as coreConfig } from './config/core';
import * as nethermindConfig from './config/nethermind';
import { base as erigonConfig } from './config/erigon';
import * as prysmConfig from './config/prysm';
import Web3 from 'web3';
import { EthereumPreMerge } from '../shared/ethereum-pre-merge';

interface EthereumCryptoNodeData extends CryptoNodeData {
  authPort?: number
  consensusPeerPort?: number
  consensusRPCPort?: number
  consensusDockerImage?: string
}
interface EthereumVersionDockerImage extends VersionDockerImage {
  consensusImage: string
}

export class Ethereum extends EthereumPreMerge {

  static versions(client: string, networkType: string): EthereumVersionDockerImage[] {
    client = client || Ethereum.clients[0];
    let versions: EthereumVersionDockerImage[];
    switch(client) {
      case NodeClient.GETH:
        versions = [
          {
            version: '1.10.25',
            clientVersion: '1.10.25',
            image: 'ethereum/client-go:v1.10.25',
            consensusImage: 'rburgett/prysm-beacon-chain:v3.1.1',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
            async upgrade(data: EthereumCryptoNodeData): Promise<boolean> {
              const fs = new FS(new Docker());
              if(!data.configDir)
                return false;
              const configPath = path.join(data.configDir, Ethereum.configName(data));
              const configExists = await fs.pathExists(configPath);
              if(!configExists)
                return false;
              const config = await fs.readFile(configPath);
              const splitConfig = config.split('\n');
              let nodeBlockStart = splitConfig.findIndex(s => /^\[Node]/.test(s.trim()));
              if(nodeBlockStart < 0) {
                nodeBlockStart = splitConfig.length;
                splitConfig.push('[Node]');
              }
              let nextBlockStart = splitConfig
                .findIndex((s, i) => {
                  return i > nodeBlockStart && /^\[.+]/.test(s.trim());
                });
              if(nextBlockStart < 0)
                nextBlockStart = splitConfig.length;
              let authAddrIdx = -1, authPortIdx = -1, authVirtualHostsIdx = -1, jwtSecretIdx = -1, dataDirIdx = -1;
              for(let i = nodeBlockStart + 1; i < nextBlockStart; i++) {
                const s = splitConfig[i];
                if(/^AuthAddr/.test(s.trim())) {
                  authAddrIdx = i;
                } else if(/^AuthPort/.test(s.trim())) {
                  authPortIdx = i;
                } else if(/^AuthVirtualHosts/.test(s.trim())) {
                  authVirtualHostsIdx = i;
                } else if(/^JWTSecret/.test(s.trim())) {
                  jwtSecretIdx = i;
                } else if(/^DataDir/.test(s.trim())) {
                  dataDirIdx = i;
                }
              }
              const toAdd = [];
              const authAddVal = 'AuthAddr = "0.0.0.0"';
              if(authAddrIdx > -1) {
                splitConfig[authAddrIdx] = authAddVal;
              } else {
                toAdd.push(authAddVal);
              }
              const authPortVal = `AuthPort = ${data.authPort || Ethereum.defaultAuthPort[data.network || Ethereum.networkTypes[0]]}`;
              if(authPortIdx > -1) {
                splitConfig[authPortIdx] = authPortVal;
              } else {
                toAdd.push(authPortVal);
              }
              const authVirtualHostsVal = 'AuthVirtualHosts = ["*"]';
              if(authVirtualHostsIdx > -1) {
                splitConfig[authVirtualHostsIdx] = authVirtualHostsVal;
              } else {
                toAdd.push(authVirtualHostsVal);
              }
              const jwtSecretVal = 'JWTSecret = "/root/config/jwt.hex"';
              if(jwtSecretIdx > -1) {
                splitConfig[jwtSecretIdx] = jwtSecretVal;
              } else {
                toAdd.push(jwtSecretVal);
              }
              const dataDirVal = 'DataDir = "/root/data"';
              if(dataDirIdx > -1) {
                splitConfig[dataDirIdx] = dataDirVal;
              } else {
                toAdd.push(dataDirVal);
              }
              const newConfig = [
                ...splitConfig.slice(0, nextBlockStart),
                ...toAdd,
                '',
                ...splitConfig.slice(nextBlockStart),
              ];
              const joined = newConfig
                .join('\n')
                .replace(/\n{3,}/g, '\n\n');
              await fs.writeFile(configPath, joined, 'utf8');
              return true;
            },
          },
          {
            version: '1.10.24',
            clientVersion: '1.10.24',
            image: 'ethereum/client-go:v1.10.24',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.21',
            clientVersion: '1.10.21',
            image: 'ethereum/client-go:v1.10.21',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.19',
            clientVersion: '1.10.19',
            image: 'ethereum/client-go:v1.10.19',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.17',
            clientVersion: '1.10.17',
            image: 'ethereum/client-go:v1.10.17',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.15',
            clientVersion: '1.10.15',
            image: 'ethereum/client-go:v1.10.15',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.14',
            clientVersion: '1.10.14',
            image: 'ethereum/client-go:v1.10.14',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: true,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
            async upgrade(data: CryptoNodeData): Promise<boolean> {
              const fs = new FS(new Docker());
              const { configDir } = data;
              const configPath = configDir ? path.join(configDir, Ethereum.configName(data)) : '';
              if(configPath && (await fs.pathExists(configPath))) {
                const conf = await fs.readFile(configPath, 'utf8');
                const splitConf = conf
                  .split('\n')
                  .map(str => str.trim());
                const syncModeFastIdx = splitConf
                  .findIndex(str => {
                    const split = str
                      .split('=')
                      .map(s => s.trim());
                    const [ key = '', val = '' ] = split;
                    return key === 'SyncMode' && val.includes('fast');
                  });
                if(syncModeFastIdx >= 0) {
                  const newConf = [
                    ...splitConf.slice(0, syncModeFastIdx),
                    'SyncMode = "snap"',
                    ...splitConf.slice(syncModeFastIdx + 1),
                  ].join('\n');
                  await fs.writeFile(configPath, newConf, 'utf8');
                }
              }
              return true;
            },
          },
          {
            version: '1.10.13',
            clientVersion: '1.10.13',
            image: 'ethereum/client-go:v1.10.13',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.12',
            clientVersion: '1.10.12',
            image: 'ethereum/client-go:v1.10.12',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.11',
            clientVersion: '1.10.11',
            image: 'ethereum/client-go:v1.10.11',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.10',
            clientVersion: '1.10.10',
            image: 'ethereum/client-go:v1.10.10',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.3',
            clientVersion: '1.10.3',
            image: 'ethereum/client-go:v1.10.3',
            consensusImage: '',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
        ];
        break;
      case NodeClient.NETHERMIND:
        versions = [
          {
            version: '1.14.0',
            clientVersion: '1.14.0',
            image: 'nethermind/nethermind:1.14.0',
            consensusImage: '',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.13.6',
            clientVersion: '1.13.6',
            image: 'nethermind/nethermind:1.13.6',
            consensusImage: '',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
        ];
        break;
      case NodeClient.ERIGON:
        versions = [
          {
            version: '2022.08.02',
            clientVersion: '2022.08.2',
            image: 'icculp/erigon:v2022.08.02',
            consensusImage: '',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
        ];
        break;
      case NodeClient.PRYSM:
        versions = [
          {
            version: '3.1.1',
            clientVersion: '3.1.1',
            image: 'prysmaticlabs/prysm-beacon-chain:v3.1.1',
            consensusImage: '',
            dataDir: '/root/data',
            walletDir: '/root/keys',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data))} `;
            },
          },
          {
            version: '3.1.0',
            clientVersion: '3.1.0',
            image: 'prysmaticlabs/prysm-beacon-chain:v3.1.0',
            consensusImage: '',
            dataDir: '/root/data',
            walletDir: '/root/keys',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data))} `;
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
    NodeClient.GETH,
    // NodeClient.NETHERMIND,
    // NodeClient.ERIGON,
    // NodeClient.PRYSM,
  ];

  static nodeTypes = [
    NodeType.FULL,
    NodeType.ARCHIVAL,
  ];

  static networkTypes = [
    NetworkType.MAINNET,
    NetworkType.RINKEBY,
    NetworkType.GOERLI,
  ];

  static roles = [
    Role.NODE,
    Role.VALIDATOR,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 8755,
    [NetworkType.RINKEBY]: 18545,
    [NetworkType.GOERLI]: 18545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8756,
    [NetworkType.RINKEBY]: 18546,
    [NetworkType.GOERLI]: 18546,
  };

  static defaultAuthPort = {
    [NetworkType.MAINNET]: 8559,
    [NetworkType.GOERLI]: 8559,
  };

  static defaultCPUs = 8;

  static defaultMem = 16384;

  static generateConfig(client: Ethereum|string = Ethereum.clients[0], network = NetworkType.MAINNET, peerPort = Ethereum.defaultPeerPort[NetworkType.MAINNET], rpcPort = Ethereum.defaultRPCPort[NetworkType.MAINNET]): string {
    let clientStr: string;
    let authPort = 0;
    if(typeof client === 'string') {
      clientStr = client;
    } else {
      clientStr = client.client;
      network = client.network;
      peerPort = client.peerPort;
      rpcPort = client.rpcPort;
      authPort = client.authPort;
    }
    authPort = authPort || Ethereum.defaultAuthPort[network];
    let config = '';
    switch(clientStr) {
      case NodeClient.GETH:
        config = coreConfig;
        break;
      case NodeClient.NETHERMIND:
        switch(network) {
          case NetworkType.MAINNET:
            config = nethermindConfig.mainnet;
            break;
          case NetworkType.RINKEBY:
            config = nethermindConfig.rinkeby;
            break;
          }
        break;
      case NodeClient.ERIGON:
        config = erigonConfig.replace('{{NETWORK}}', network.toLowerCase());
        break;
      case NodeClient.PRYSM: {
        let checkpointSyncUrl: string, genesisBeaconApiUrl: string;
        if(network === NetworkType.GOERLI) {
          checkpointSyncUrl = 'https://goerli.beaconstate.info';
          genesisBeaconApiUrl = checkpointSyncUrl;
        } else { // MAINNET
          checkpointSyncUrl = 'https://beaconstate.ethstaker.cc';
          genesisBeaconApiUrl = checkpointSyncUrl;
        }
        config = prysmConfig.beacon //.replace('{{AUTH_PORT}}', authPort);
          .replace('{{CHECKPOINT_SYNC_URL}}', checkpointSyncUrl)
          .replace('{{GENESIS_BEACON_API_URL}}', genesisBeaconApiUrl);
        break;
      } default:
        return '';
    }
    return config
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10))
      .replace('{{RPC_PORT}}', rpcPort.toString(10))
      .replace('{{AUTH_PORT}}', authPort.toString(10))
      .trim();
  }

  static configName(data: CryptoNodeData): string {
    const { network, client } = data;
    switch(client) {
      case NodeClient.NETHERMIND: {
        const {network = ''} = data;
        return network.toLowerCase() + '.cfg';
      } case NodeClient.PRYSM:
          return 'prysm.yaml';
      default:
        return 'config.toml';
    }
  }

  static consensusDockerName(id: string): string {
    return `${id}-consensus`;
  }

  id: string;
  ticker = 'eth';
  name = 'Ethereum';
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
  dockerCPUs = Ethereum.defaultCPUs;
  dockerMem = Ethereum.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  role = Ethereum.roles[0];
  authPort: number;
  consensusPeerPort: number;
  consensusRPCPort: number;
  consensusDockerImage: string;

  constructor(data: EthereumCryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Ethereum.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Ethereum.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Ethereum.clients[0];
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
    const versions = Ethereum.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    this.restartAttempts = data.restartAttempts || this.restartAttempts;
    this.authPort = data.authPort || Ethereum.defaultAuthPort[this.network];
    this.consensusPeerPort = data.consensusPeerPort || Ethereum.defaultConsensusPeerPort[this.network];
    this.consensusRPCPort = data.consensusRPCPort || Ethereum.defaultConsensusRPCPort[this.network];
    this.consensusDockerImage = this.remote ? '' : data.consensusDockerImage ? data.consensusDockerImage : (versionObj.consensusImage || '');
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  toObject(): EthereumCryptoNodeData {
    return {
      ...this._toObject(),
      authPort: this.authPort,
      consensusRPCPort: this.consensusRPCPort,
      consensusPeerPort: this.consensusPeerPort,
      consensusDockerImage: this.consensusDockerImage,
    };
  }

  async start(): Promise<ChildProcess[]> {
    const { consensusDockerImage, _fs: fs } = this;
    const versions = Ethereum.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const split = splitVersion(this.version);
    let preMerge = false;
    if(split[0] < 1) {
      preMerge = true;
    } else if(split[0] === 1 && split[1] < 10) {
      preMerge = true;
    } else if(split[0] === 1 && split[1] === 10 && split[2] < 25) {
      preMerge = true;
    }
    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);
    const consensusRunning = consensusDockerImage ? (await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.consensusDockerName())) : false;
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
        '--network', this.dockerNetwork,
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

      const configPath = path.join(configDir, Ethereum.configName(this));
      const configExists = await fs.pathExists(configPath);
      const { authPort } = this;
      if(!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');

      const consensusConfigPath = path.join(configDir, 'prysm.yaml');
      const consensusConfigExists = await fs.pathExists(consensusConfigPath);
      if(!consensusConfigExists) {
        const consensusConfig = Ethereum.generateConfig(NodeClient.PRYSM, this.network, this.rpcPort, this.peerPort).replace('{{EXEC}}', this.id + '-execution:' + authPort.toString(10));
        await fs.writeFile(consensusConfigPath, consensusConfig, 'utf8');
      }

      const jwtPath = path.join(configDir, 'jwt.hex');
      const jwtExists = await fs.pathExists(jwtPath);
      if(!jwtExists) {
        const jwt = Web3.utils.randomHex(32);
        await fs.writeFile(jwtPath, jwt, 'utf8');
      }

      args = [...args, '-v', `${configDir}:${containerConfigDir}`];
      const executionArgs = [
        ...args,
      '--name', this.id,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
      '-p', `${this.peerPort}:${this.peerPort}`,
      '-p', `${authPort}:${authPort}`,
      ];
      const consensusArgs = [
        ...args,
      '--name', this.id + '-consensus',
      '-p', `8656:${this.rpcPort}`,
      '-p', `8657:${this.peerPort}`,
      ];

      const consensusImage = 'prysmaticlabs/prysm-beacon-chain:v3.1.1';
      await this._docker.pull(this.dockerImage, str => this._logOutput(str));
      if(consensusDockerImage)
        await this._docker.pull(consensusDockerImage, str => this._logOutput(str));
      await this._docker.createNetwork(this.dockerNetwork);

      const exitCode = await new Promise<number>((resolve, reject) => {
        this._docker.run(
          this.dockerImage + versionData.generateRuntimeArgs(this),
          executionArgs,
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
        throw new Error(`Docker run for ${this.id}-execution with ${this.dockerImage} failed with exit code ${exitCode}`);

      const consensusExitCode = await new Promise<number>((resolve, reject) => {
        this._docker.run(
          consensusImage + ` --config-file=/root/config/prysm.yaml --${this.network.toLowerCase()}`,
          consensusArgs,
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
      if(consensusExitCode !== 0)
        throw new Error(`Docker run for ${this.id}-consensus with prysm failed with exit code ${consensusExitCode}`);
    }

    const instance = this._docker.attach(
      this.id,
      output => this._logOutput('execution - ' + output),
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );

    const instances = [
      instance,
    ];

  async stop(): Promise<void> {
    try {
      await this._docker.stop(this.id + '-execution');
      await this._docker.rm(this.id + '-execution');
      await timeout(1000);
      await this._docker.stop(this.id + '-consensus');
      await this._docker.rm(this.id + '-consensus');
      await timeout(1000);
    } catch(err) {
      this._logError(err);
    }
  }

  generateConfig(): string {
    return Ethereum.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort,
      );
      instances.push(consensusInstance);
    }

    this._instance = instance;
    this._instances = instances;
    return this.instances();
  }

  async stop(): Promise<void> {
    try {
      await this._docker.stop(this.id);
      await this._docker.rm(this.id);
      await timeout(1000);
      await this._docker.stop(this.consensusDockerName());
      await this._docker.rm(this.consensusDockerName());
      await timeout(1000);
    } catch(err) {
      this._logError(err);
    }
  }

  consensusDockerName(): string {
    return Ethereum.consensusDockerName(this.id);
  }

  generateConfig(): string {
    return Ethereum.generateConfig(this);
  }

}
