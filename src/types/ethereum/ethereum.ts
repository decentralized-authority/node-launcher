import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import path from 'path';
import os from 'os';
import { filterVersionsByNetworkType, splitVersion, timeout } from '../../util';
import { FS } from '../../util/fs';
import { base as coreConfig } from './config/core';
import * as nethermindConfig from './config/nethermind';
import { base as erigonConfig } from './config/erigon';
import * as prysmConfig from './config/prysm';
import Web3 from 'web3';
import { EthereumPreMerge } from '../shared/ethereum-pre-merge';
//import { nodeModuleNameResolver } from 'typescript';
import * as bip39 from 'bip39';
import { Wallet, providers } from 'ethers';
//import { number } from 'mathjs';
import { contractAbi } from './contractAbi';
import { encrypt, decrypt } from '../../util/crypto';
import { Console } from 'console';
//import { times } from 'lodash';


interface EthereumCryptoNodeData extends CryptoNodeData {
  authPort?: number
  consensusPeerPort?: number
  consensusRPCPort?: number
  consensusDockerImage?: string
  validatorDockerImage?: string
  validatorRPCPort?: number
  stakingDockerImage?: string
  passwordPath?: string
  eth1Address?: string
  //mnemonicEncrypted?: string
  //eth1PrivateKeyEncrypted?: string
  //validatorPublicKeys?: string[]
  //slasherDockerImage?: string
  //metricsDockerImage?: string
}
interface EthereumVersionDockerImage extends VersionDockerImage {
  consensusImage: string
  stakingImage?: string
  validatorImage?: string
  passwordPath?: string
  //mevImage?: string
}

interface DepositKeyInterface {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
  deposit_cli_version: string;
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
            validatorImage: 'prysmaticlabs/prysm-validator:v3.1.1',
            stakingImage: 'icculp/staking-deposit-cli:v2.3.0-DEBUG',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
            validatorImage: '',
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
    [NetworkType.GOERLI]: 17545,
  }; // 8545

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8756,
    [NetworkType.RINKEBY]: 18546,
    [NetworkType.GOERLI]: 17546,
  }; // 30303

  static defaultAuthPort = {
    [NetworkType.MAINNET]: 8551,
    [NetworkType.GOERLI]: 7551,
  };

  static defaultConsensusRPCPort = {
    [NetworkType.MAINNET]: 8757,
    [NetworkType.GOERLI]: 17757,
  }; // 3500 grpc query api default --grpc-gateway-port (host must be enabled, cors modified), 4000 validator grpc default --rpc

  static defaultConsensusPeerPort = {
    [NetworkType.MAINNET]: 8758,
    [NetworkType.GOERLI]: 17758,
  }; // 1300tcp and 1200udp defaults (technical debt again), but can be same. need to open both tcp and udp

  static defaultValidatorRPCPort = {
    [NetworkType.MAINNET]: 7000,
    [NetworkType.GOERLI]: 18000,
  }; // validator grpc gateway 

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
          .replace('{{GENESIS_BEACON_API_URL}}', genesisBeaconApiUrl)
          //.replace('{{RPC_PORT}}', '4000'); // to be fixed
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

  static validatorDockerName(id: string): string {
    return `${id}-validator`;
  }

  static stakingDockerName(id: string): string {
    return `${id}-staking`;
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
  validatorDockerImage: string;
  stakingDockerImage: string;
  validatorRPCPort: number;
  passwordPath = '';
  eth1Address = '';
  //mnemonicEncrypted: '';

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
    //this.consensusGRPCPort = data.consensusGRPCPort || Ethereum.defaultConsensusGRPCPort[this.network];
    this.consensusDockerImage = this.remote ? '' : data.consensusDockerImage ? data.consensusDockerImage : (versionObj.consensusImage || '');
    this.stakingDockerImage = this.remote ? '' : data.stakingDockerImage ? data.stakingDockerImage : (versionObj.stakingImage || '');
    this.validatorDockerImage = this.remote ? '' : data.validatorDockerImage ? data.validatorDockerImage : (versionObj.validatorImage || '');
    this.validatorRPCPort = data.validatorRPCPort || Ethereum.defaultValidatorRPCPort[this.network];
    this.passwordPath = data.passwordPath || this.passwordPath;
    //this.mnemonicEncrypted = data.mnemonicEncrypted || this.mnemonicEncrypted;
    this.eth1Address = data.eth1Address || this.eth1Address;
    //this.eth1PrivateKeyEncrypted = data.eth1PrivateKeyEncrypted || this.eth1PrivateKeyEncrypted;
    //validatorPublicKeys?: string[]

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
      //consensusGRPCPort: this.consensusGRPCPort,
      //mnemonicEncrypted: this.mnemonicEncrypted,
      consensusPeerPort: this.consensusPeerPort,
      consensusDockerImage: this.consensusDockerImage,
      stakingDockerImage: this.stakingDockerImage,
      validatorDockerImage: this.validatorDockerImage,
    };
  }

  async start(password?: string, mnemonic?: string, eth1AccountIndex = 0, slasher = 0): Promise<ChildProcess[]> {
    const prysmValidatorPort = '4000';
    const { consensusDockerImage, validatorDockerImage, _fs: fs } = this;
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
    const validatorRunning = validatorDockerImage ? (await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.validatorDockerName())) : false;
    const instances = []
    if(!running) {
      const {
        dataDir: containerDataDir,
        walletDir: containerWalletDir,
        configDir: containerConfigDir,
      } = versionData;
      let args = [
        '-d',
        `--rm`, //estart=on-failure:${this.restartAttempts}`,
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
      args = [...args, '-v', `${configDir}:${containerConfigDir}`];
      await fs.ensureDir(configDir);

      const configPath = path.join(configDir, Ethereum.configName(this));
      const configExists = await fs.pathExists(configPath);
      const { authPort } = this;
      if(!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');
      
      if(!preMerge) {
        const consensusConfigPath = path.join(configDir, 'prysm-beacon.yaml');
        const consensusConfigExists = await fs.pathExists(consensusConfigPath);
        if(!consensusConfigExists) {
          const consensusConfig = Ethereum.generateConfig(NodeClient.PRYSM, this.network, this.consensusPeerPort, this.consensusRPCPort)
            .replace('{{EXEC}}', `http://${this.id}:${authPort.toString(10)}`)
            .replace('{{VALIDATOR_RPC_PORT}}', prysmValidatorPort); // not to be confused with grpc-gateway
          await fs.writeFile(consensusConfigPath, consensusConfig, 'utf8');
        }
      }
      //console.log(this.role, password);
      const jwtPath = path.join(configDir, 'jwt.hex');
      const jwtExists = await fs.pathExists(jwtPath);
      if(!jwtExists) {
        const jwt = Web3.utils.randomHex(32);
        await fs.writeFile(jwtPath, jwt, 'utf8');
      }

      if (slasher) {
        this.enableSlasher()
      } else {
        this.disableSlasher()
      }
      const executionArgs = [
        ...args,
        '--name', this.id,
        '-p', `${this.rpcPort}:${this.rpcPort}`,
        '-p', `${this.peerPort}:${this.peerPort}`,
        //'-p', `${authPort}:${authPort}`,
      ];
      const consensusArgs = [
        ...args,
      '--name', this.consensusDockerName(),
      '-p', `${this.consensusRPCPort}:${this.consensusRPCPort}`,
      '-p', `${this.consensusPeerPort}:${this.consensusPeerPort}`,
      '-p', `${this.consensusPeerPort}:${this.consensusPeerPort}/udp`
      ]
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
        throw new Error(`Docker run for ${this.id} execution with ${this.dockerImage} failed with exit code ${exitCode}`);
      if(!consensusRunning && consensusDockerImage) {
        const consensusExitCode = await new Promise<number>((resolve, reject) => {
          this._docker.run(
            consensusDockerImage + ` --config-file=/root/config/prysm-beacon.yaml --${this.network.toLowerCase()}`,
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
          throw new Error(`Docker run for ${this.consensusDockerName()} with prysm failed with exit code ${consensusExitCode}`);
      }
      if (this.role === Role.VALIDATOR && !password) {
        throw new Error('You must pass in a password the first time you run start() on a validator. This password will be used to generate the key pair.');
      } else if (this.role == Role.VALIDATOR && !validatorRunning && password ){
        const mnemonicPath = path.join(this.walletDir + "/mnemonic.enc")
        const mnemonicExists = await this._fs.pathExists(mnemonicPath);
        if (!mnemonicExists || this.eth1Address == '')
          await this.encryptMnemonic(password)

        const passwordPath = this.passwordPath || path.join(tmpdir, uuid());
        const passwordFileExists = await fs.pathExists(passwordPath);
        if(!passwordFileExists)
          await fs.writeFile(passwordPath, password, 'utf8');
        const containerPasswordPath = '/.hidden/pass.pwd'
        // console.log(983, passwordPath, containerPasswordPath);
        await this.prysmImportValidator(passwordPath, containerPasswordPath);
        const validatorInstance = await this.prysmRunValidator(passwordPath, containerPasswordPath);
        instances.push(validatorInstance)
      } //end validator
    } // end !running
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

    if(!preMerge) {
      const consensusInstance = this._docker.attach(
        this.consensusDockerName(),
        output => this._logOutput('consensus - ' + output),
        err => {
          this._logError(err);
        },
        code => {
          this._logClose(code);
        },
      );
      instances.unshift(consensusInstance);
    }
    instances.unshift(instance)
    this._instance = instance;
    this._instances = instances;
    return this.instances();
  } // end start()

  async stop(): Promise<void> {
    try {
      await this._docker.stop(this.id);
      await this._docker.rm(this.id);
      await timeout(1000);
      await this._docker.stop(this.consensusDockerName());
      await this._docker.rm(this.consensusDockerName());
      await timeout(1000);
      await this._docker.stop(this.validatorDockerName());
      await this._docker.rm(this.validatorDockerName());
      await timeout(1000);
    } catch(err) {
      this._logError(err);
    }
  }

  async stakeValidator(password: string, numVals = 1, validatorStartIndex = 0, eth1AccountIndex = 0): Promise<string[]> {
    const mnemonic = decrypt(await this._fs.readFile(this.walletDir + "/mnemonic.enc", 'base64'), password);
    const stakingRunning = this.stakingDockerImage ? (await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.stakingDockerName())) : false;
    await this._docker.pull(this.stakingDockerImage, str => this._logOutput(str));
    const stakingDir = path.join(this.walletDir, 'validator_keys');
    await this._fs.ensureDir(stakingDir);
    const stakingArgs = [
      '-d',
      `--rm`,
      '--name', this.stakingDockerName(),
      '-v', `${stakingDir}:/root/keystore/validator_keys`,
    ]
    if (numVals > 64)
      throw new Error('Geth can only support 64 unmined transactions from the same account without crashing');
    //const validatorStartIndex = 0; // if user provides already used mnemonic start index will be higher. later if we add a feature to add more accounts (32 eth each) to a running validator, so we would need to track the index.
    //const numVals = 1; // 32 eth each, deposit.json will have x num deposit tx's to sign and send to deposit contract, and x num keystores generated off of the same mnemonic. derivation path should be m/12381/3600/{x}/0/0 
    const mnemonicEncrypted = await this._fs.readFile(path.join(this.walletDir, 'mnemonic.enc'), 'base64');
    const stakingRun = ` --language=english --non_interactive existing-mnemonic ` +
      `--mnemonic="{{MNEMONIC}}" --validator_start_index=${validatorStartIndex} ` +
      `--num_validators=${numVals} --folder=/root/keystore ` +
      `--chain ${this.network.toLowerCase()} --keystore_password {{PASSWORD}}`;
    console.log(stakingRun);
    const stakingExitCode = await new Promise<number>((resolve, reject) => {
      this._docker.run(
        this.stakingDockerImage + stakingRun.replace('{{MNEMONIC}}', decrypt(mnemonicEncrypted, password)).replace('{{PASSWORD}}', password),
        stakingArgs,
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
    const stakingInstance = this._docker.attach(
      this.stakingDockerName(),
      output => this._logOutput('staking - ' + output),
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );
    if(stakingExitCode !== 0)
      throw new Error(`Docker run for ${this.stakingDockerImage} failed with exit code ${stakingExitCode}`);
      // end staking cli deposit
    //console.log("{" + mnemonic + "}");
    await(timeout(10000))
    //const fs_ = require('fs');
    
    
    const files = await this._fs.readdir(stakingDir)
    const timestamps: Array<number> = [];
    for (const file of files) {
      if (file.includes('deposit_data-')) {
        timestamps.push(parseInt(file.split('-', 2)[1].split('.', 1)[0]));
      }
    }
    //console.log(1065, timestamps)
    const latestTimestamp = timestamps.reduce((a: number, b: number) => Math.max(a, b), 0);
    const depositJSON = JSON.parse(await this._fs.readFile(path.join(stakingDir, 'deposit_data-' + String(latestTimestamp) + '.json')));
    const depositTXs: string[] = []
    if (depositJSON && Array.isArray(depositJSON) ) {
      console.log(1072, "first if")
      for (const deposit of depositJSON) {
        console.log(1071, deposit)
        try {
          depositTXs.push(await this.validatorDeposit(deposit, password, eth1AccountIndex));
        } catch(err) {
          console.log("Transaction failed due to error:", err)
          depositTXs.push("Pubkey {" + deposit.pubkey + "} " + err)
        }
      };
    } else {
      console.log(1074, typeof depositJSON)
      try {
        depositTXs.push(await this.validatorDeposit(depositJSON, password, eth1AccountIndex));
      } catch(err) {
        console.log("Transaction failed due to error:", err)
        depositTXs.push(err)
      } 
    }
    // reload validator keys
    // prysm not neccessary to reload if we reimport;
    const tmpdir = os.tmpdir();
    const passwordPath = this.passwordPath || path.join(tmpdir, uuid());
    const passwordFileExists = await this._fs.pathExists(passwordPath);
    if(!passwordFileExists)
      await this._fs.writeFile(passwordPath, password, 'utf8');
    const containerPasswordPath = '/.hidden/pass.pwd'
    // console.log(983, passwordPath, containerPasswordPath);
    await this.prysmImportValidator(passwordPath, containerPasswordPath);
    // run prysmValidator()
    const validatorRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.validatorDockerName());
    if (!validatorRunning)
      this.prysmRunValidator(passwordPath, containerPasswordPath)
    //await this.stop(); 
    //this.start(password);
    return depositTXs
  } // end stakeValidator()

  async validatorDeposit(depositJSON: DepositKeyInterface, password: string, eth1AccountIndex = 0, topUp?: false): Promise<string> {
    if (!await this.beaconSynced()) {
      console.log("In order to prevent duplicate deposits and loss of funds, we require your node to be fully synced before staking your validators.")
      return 'Sync your beacon node'
    }
    if (topUp){
      // logic for topping up slashed validator
    }
    const activeValidatorStatuses = ['pending_initialized', 'pending_queued', 'active_ongoing', 'active_exiting', 'active_slashed', 'exited_unslashed', 'exited_slashed']
    const status = await this.validatorStatus(depositJSON.pubkey)
    if (activeValidatorStatuses.includes(status)){
      const message = "A deposit already exists for pubkey {" + depositJSON.pubkey + "} with current state {" + status + "}"
      console.log(message)
      return message
    } else if (status == 'invalid') {
      console.log("Uh oh, there is a problem with the deposit.json data. Please reach out.")
      return 'HELP'
    } else if (status == 'not found'){
        // okay to proceed
      const mainnetStakingAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
      const goerliStakingAddress = '0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b';
      const jsonUrl = `http://localhost:${this.rpcPort}`;
      const mnemonicEncrypted = await this._fs.readFile(this.walletDir + "/mnemonic.enc", 'base64');
      const eth1DerivationPath = `m/44'/60'/0'/0/${eth1AccountIndex.toString()}`; //m/44/60/0/0/i is eth1 wallet (aka account aka withdrawal) for account number i
      console.log(1059, decrypt(mnemonicEncrypted, password), eth1DerivationPath, jsonUrl)
      const eth1Wallet = Wallet.fromMnemonic(decrypt(mnemonicEncrypted, password), eth1DerivationPath);

      const web3 = new Web3(new Web3.providers.HttpProvider(jsonUrl));
      const eth1Account = web3.eth.accounts.privateKeyToAccount(eth1Wallet.privateKey) // 
      web3.eth.accounts.wallet.add(eth1Account)

      const depositContract = new web3.eth.Contract(contractAbi, this.network == NetworkType.MAINNET ? mainnetStakingAddress : goerliStakingAddress); //, signer);
      console.log(eth1Wallet.address, eth1Account.address)
      console.log(decrypt(mnemonicEncrypted, password))
      console.log(1065, eth1Account.address, this.network);
      const transactionParameters = {
        gasPrice: Web3.utils.toHex(await web3.eth.getGasPrice()),
        from: eth1Account.address,
        value: Web3.utils.toWei('32', 'ether'),
        gasLimit: 15000000,
        gas: 0,
        data: {}
      };
      console.log(1101, await web3.eth.getTransactionCount(eth1Account.address), await web3.eth.getTransactionCount(eth1Account.address, 'pending'))
      // either need to add nonce to transactions, or do one transaction at a time and wait for confirmation
      // can find out transaction cound, then query by address and 'pending'
      // but if error, should either warn user to restart GETH before restaking in order to clear pending transactions, to prevent possible nonce gaps and duplicated deposits (locking up eth)
      // probably just force geth restart
      // I prefer the latter since we have short block times. to send multiple transactions can result in a nonce gap which with a large number of deposits would require constantly polling status of all transactions until they all complete or all past the gap will get stuck
      const gasEstimate = await depositContract.methods.deposit( 
        '0x' + depositJSON.pubkey,
        '0x' + depositJSON.withdrawal_credentials,
        '0x' + depositJSON.signature,
        '0x' + depositJSON.deposit_data_root
        ).estimateGas(transactionParameters).catch(function(error: any) {
          console.log("Estimategas() - catch error");
          console.log(error);
          return "Pubkey {" + depositJSON.pubkey + "} " + error.message
        }); //.on('error', console.warn);
      //console.log(1087, transactionParameters, typeof gasEstimate) 
      if ((typeof gasEstimate) === "string"){
        return gasEstimate
      } else if ((typeof gasEstimate) === "number" ) {
        transactionParameters.gas = gasEstimate;
      } else {
        return "Unexpected error, gasEstimate: {" + gasEstimate + "} pubkey {" + depositJSON.pubkey + "}"
      }
        
      // if error in estimate*, send won't take value but catch here only catches error responses, so input error throws error to catch in stake function
      const depositTX = await depositContract.methods.deposit(
        '0x' + depositJSON.pubkey,
        '0x' + depositJSON.withdrawal_credentials,
        '0x' + depositJSON.signature,
        '0x' + depositJSON.deposit_data_root
      ).send(transactionParameters).catch(function(error: any) {
          console.log("Send() - catch error");
          console.log(error);
          return "Pubkey {" + depositJSON.pubkey + "} " + error.message
        });

    console.log(1110, Object.getOwnPropertyNames(depositTX))
    while (true) {
      console.log('while true')
      console.log(depositTX, depositTX.transactionHash)
      if (depositTX && depositTX.transactionHash) {
        const receipt = await web3.eth.getTransactionReceipt(depositTX.transactionHash);
        console.log(1112, receipt.status)
        if (receipt && receipt.blockNumber) {
          console.log("Your deposit for pubkey " + depositJSON.pubkey + "has been confirmed at block number " + receipt.blockNumber);
          console.log("Note that it might take 30 - 90 sceonds for the block to propagate before it's visible in etherscan.io");
          break;
        }
      } else { // no tx hash to wait for receipt
        break;
      }
      //console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
      await timeout(4000);
    }
    console.log("before return stakeValidator")
    console.log(Object.getOwnPropertyNames(depositTX), depositTX);
    return  depositTX;
  } else {
    return `We received an unexpected status: {${status}}`;
  }
    // if tracking validatorStartIndex, increment here      
    //return 'success'
  } // end validatorDeposit()

  async beaconSynced(): Promise<boolean> {
    try {
      const apiEndpointPath = '/eth/v1/node/syncing';
      const { body = {} } = await request.get(`0.0.0.0:${this.consensusRPCPort}${apiEndpointPath}`)
      if (body.data && body.data.is_syncing) {
        console.log('Beacon chain still syncing')
        return false
      } else if (body.data && !(body.data.is_syncing)) {
        return true
      } else
        return false
    } catch(err) {
      console.log(err)
      return false
    }
  }

  async validatorStatus(validatorPubKey: string): Promise<string> {
    // validate pubkey format
    try {
      const apiEndpointPath = '/eth/v1/beacon/states/head/validators/0x';
      const { body = {} } = await request.get(`0.0.0.0:${this.consensusRPCPort}${apiEndpointPath}${validatorPubKey}`)
      console.log(body)
      if (body.data && body.data.status) {
        console.log(body.data.status)
        return body.data.status
      } else if (body.code && body.message) {
        console.log(body.code, body.message)
        return body.message
      }
    } catch(err) {
      if (err.status == 404) {
        return 'not found'
      }
      else if (err.status == 400) {
        return 'invalid'
      } else {
        console.log(err)
      }
      return `Failed to query validator status, ensure that the beacon node is reachable at port ${this.consensusRPCPort}`;
    }
    return `We shouldn't reach here`;
  }
  //  0.0.0.0:55002/eth/v1/node/syncing | jq .data.is_syncing

  async prysmRunValidator(passwordPath: string, containerPasswordPath: string): Promise<ChildProcess> {
    const prysmValidatorPort = '4000';
    const versions = Ethereum.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configDir: containerConfigDir,
    } = versionData;
    let args = [
      '-d',
      `--rm`, //estart=on-failure:${this.restartAttempts}`,
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--network', this.dockerNetwork,
    ];
    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    args = [...args, '-v', `${dataDir}:${containerDataDir}`];
    await this._fs.ensureDir(dataDir);
    const walletDir = this.walletDir || path.join(tmpdir, uuid());
    args = [...args, '-v', `${walletDir}:${containerWalletDir}`];
    await this._fs.ensureDir(walletDir);
    const configDir = this.configDir || path.join(tmpdir, uuid());
    args = [...args, '-v', `${configDir}:${containerConfigDir}`];
    await this._fs.ensureDir(configDir);

    const validatorConfigPath = path.join(configDir, 'prysm-validator.yaml');
    const validatorConfigExists = await this._fs.pathExists(validatorConfigPath);
    if(!validatorConfigExists) {
      const validatorConfig = prysmConfig.validator
        //.replace('{{EXEC}}', `http://${this.id}:${authPort.toString(10)}`);
        .replace('{{ETH1_ADDRESS}}', this.eth1Address)
        .replace(/{{CONSENSUS}}/g, `${this.consensusDockerName()}:${prysmValidatorPort}`)
        .replace('{{RPC_PORT}}', this.validatorRPCPort.toString(10))
      await this._fs.writeFile(validatorConfigPath, validatorConfig, 'utf8');
    }
    const validatorArgs = [
      ...args,
      '--name', this.validatorDockerName(),
      //'-p', `${this.validatorRPCPort}:${this.validatorRPCPort}`,
      '-v', `${passwordPath}:${containerPasswordPath}`,
    ];
    const validatorExitCode = await new Promise<number>((resolve, reject) => {
      this._docker.run(
        this.validatorDockerImage + ` --config-file=/root/config/prysm-validator.yaml --${this.network.toLowerCase()}`,
        validatorArgs,
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
    if(validatorExitCode !== 0)
      throw new Error(`Docker run for ${this.validatorDockerImage} failed with exit code ${validatorExitCode}`);
    const validatorInstance = this._docker.attach(
      this.validatorDockerName(),
      output => this._logOutput('validator - ' + output),
      err => {
        this._logError(err);
      },
      code => {
        this._logClose(code);
      },
    );
    return(validatorInstance);
  }

  async prysmImportValidator(passwordPath: string, containerPasswordPath: string): Promise<boolean> {
    // keys created from staking cli imported into prysm account format
    const stakingDir = path.join(this.walletDir, 'validator_keys');
    await this._fs.ensureDir(stakingDir);
    const files = await this._fs.readdir(stakingDir)
    if (!files.length){
      return false
    }
    const importRun = ` --config-file=/root/config/prysm-validator.yaml accounts import --${this.network.toLowerCase()}`;
    console.log(1216, this.walletDir, this.passwordPath)
    const importArgs = [
      '--rm',
      '--name', this.id + '-import',
      '-v', `${this.walletDir}:/root/keystore`,
      '-v', `${this.configDir}:/root/config`,
      '-v', `${this.dataDir}:/root/data`,
      '-v', `${passwordPath}:${containerPasswordPath}`,
    ];
    const importExitCode = await new Promise<number>((resolve, reject) => {
      this._docker.run(
        this.validatorDockerImage + importRun,
        importArgs,
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
    if(importExitCode !== 0)
      throw new Error(`Docker run for ${this.validatorDockerImage} failed with exit code ${importExitCode}`);
    await timeout(5000);
    return true
  }
  // queryDepositStatus()
  //    eth/v1/beacon/states/head/validators
  // /eth/v1/beacon/states/head/validators/0x962bfa7dca6c653d329f6f7641401dfbdd49768ee1ec9aedbd18526e947d73f106d59005dc61dbf4c9e2b733f9fd09db


  // exitValidator()

  // generate and encrypt mnemonic (don't leave mnemonic running in memory via start() )
 async encryptMnemonic(password: string, mnemonic?: string, eth1AccountIndex = 0) {
    console.log(mnemonic, 1100)
    console.log(1249, this.walletDir)
    const mnemonicPath = path.join(this.walletDir, "mnemonic.enc")
    const mnemonicExists = await this._fs.pathExists(mnemonicPath);
    console.log(mnemonicPath, mnemonicExists)
    if (mnemonic){ // if called with mnemonic passed, overwrite existing mnemonic.enc
      console.log(1103, this.walletDir);
      await this._fs.ensureDir(this.walletDir)
      await this._fs.writeFile(mnemonicPath, JSON.stringify(encrypt(mnemonic, password)), 'base64');
      console.log('written', mnemonic)
    } else if (!mnemonic && !mnemonicExists){
      mnemonic = bip39.generateMnemonic(256);
      console.log(`Mnemonic: {${mnemonic}}`, this.walletDir);
      await(timeout(1000));
      await this._fs.writeFile(this.walletDir + "/mnemonic.enc", JSON.stringify(encrypt(mnemonic, password)), 'base64');
    } else {
      console.log(1111);
      mnemonic = decrypt(await this._fs.readFile(this.walletDir + "/mnemonic.enc", 'base64'), password);
    }
    // if (!this.mnemonicEncrypted) 
    //   this.mnemonicEncrypted = encrypt(mnemonic, password);
    // }
    const eth1DerivationPath = `m/44'/60'/0'/0/${eth1AccountIndex.toString()}`; 
    // m/44/60/0/0/i is eth1 wallet (aka account aka withdrawal) for account number i
    // for example, if importing the 4th account from metamask, i would be 3
    //const mnemonicTest = decrypt(await this._fs.readFile(this.walletDir + "/mnemonic.enc", 'utf8'), password);
    if (!this.eth1Address || this.eth1Address == '') {
      console.log('here?', mnemonic, eth1DerivationPath);
      this.eth1Address = Wallet.fromMnemonic(mnemonic, eth1DerivationPath).address;
      console.log("Eth1 Wallet address to fund with 32ETH + gas to per Validator\nYou can also find this at suggested-fee-recipient: in config/prysm-validator.yml", this.eth1Address);
    }
    await timeout(5000);
    //const mnemonicEncrypted = encrypt(mnemonic, password)
    console.log("Mnemonic encrypted");
  }

  async enableSlasher(): Promise<boolean> {
    const consensusConfigPath = path.join(this.configDir, 'prysm-beacon.yaml');
    const consensusConfigExists = await this._fs.pathExists(consensusConfigPath);
    if(!consensusConfigExists)
      return false;
    const consensusConfig = await this._fs.readFile(consensusConfigPath);
    await this._fs.writeFile(consensusConfigPath, consensusConfig.replace('historical-slasher-node: false', 'historical-slasher-node: true')
                                                                 .replace('slasher: false', 'slasher: true'), 'utf8');
    //prysm no longer supports remote slasher protection, use doppelganger isntead
    // const validatorConfigPath = path.join(this.configDir, 'prysm-validator.yaml');
    // const validatorConfigExists = await this._fs.pathExists(validatorConfigPath);
    // if(!validatorConfigExists)
    //   return false;
    // const validatorConfig = await this._fs.readFile(validatorConfigPath);
    // await this._fs.writeFile(validatorConfigPath, validatorConfig.replace('enable-external-slasher-protection: false', 'enable-external-slasher-protection: true'), 'utf8');
    console.log("Slashing protection enabled")
    await timeout(3000)
    return true;
  }

  async disableSlasher(): Promise<boolean> {
    console.log(1310, this.configDir)
    const consensusConfigPath = path.join(this.configDir, 'prysm-beacon.yaml');
    const consensusConfigExists = await this._fs.pathExists(consensusConfigPath);
    if(!consensusConfigExists)
      return false;
    const consensusConfig = await this._fs.readFile(consensusConfigPath);
    await this._fs.writeFile(consensusConfigPath, consensusConfig.replace('historical-slasher-node: true', 'historical-slasher-node: false')
                                                                 .replace('slasher: true', 'slasher: false'), 'utf8');
    console.log("Slashing protection disabled")
    await timeout(3000)
    // const validatorConfigPath = path.join(this.configDir, 'prysm-validator.yaml');
    // const validatorConfigExists = await this._fs.pathExists(validatorConfigPath);
    // if(!validatorConfigExists)
    //   return false;
    // const validatorConfig = await this._fs.readFile(validatorConfigPath);
    // await this._fs.writeFile(validatorConfigPath, validatorConfig.replace('enable-external-slasher-protection: true', 'enable-external-slasher-protection: false'), 'utf8');
    return true;
  }
    
  consensusDockerName(): string {
    return Ethereum.consensusDockerName(this.id);
  }
  validatorDockerName(): string {
    return Ethereum.validatorDockerName(this.id);
  }
  stakingDockerName(): string {
    return Ethereum.stakingDockerName(this.id);
  }

  generateConfig(): string {
    return Ethereum.generateConfig(this);
  }
  
}
