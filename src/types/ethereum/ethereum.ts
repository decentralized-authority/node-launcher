import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { filterVersionsByNetworkType, splitVersion, timeout, getSecretsDir } from '../../util';
import { encrypt, decrypt, hexPrefix, EncryptedKeystore, generateEth2ValidatorKeystore } from '../../util/crypto';
import { Docker } from '../../util/docker';
import { FS } from '../../util/fs';
import { base as coreConfig } from './config/core';
import * as nethermindConfig from './config/nethermind';
import * as prysmConfig from './config/prysm';
import { base as erigonConfig } from './config/erigon';
import { base as nimbusConfig, validator as nimbusValidatorConfig } from './config/nimbus';
import { teku as tekuConfig, validator as tekuValidatorConfig } from './config/teku';
import { base as lighthouseBase, validator as lighthouseValidator } from './config/lighthouse';
import { EthereumPreMerge } from '../shared/ethereum-pre-merge';
import { contractAbi } from './contract-abi';
import { Wallet } from 'ethers';
import * as bip39 from 'bip39';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import path from 'path';
import os from 'os';
import Web3 from 'web3';

export interface EthereumCryptoNodeData extends CryptoNodeData {
  jwt: string
  authPort?: number
  consensusClient?: string
  consensusVersion?: string
  consensusPeerPort?: number
  consensusRPCPort?: number
  consensusDockerImage?: string
  validatorDockerImage?: string
  validatorRPCPort?: number
  passwordPath?: string
  eth1Address?: string
  mnemonicEncrypted?: EncryptedKeystore
  validators: Validators
}

export interface EthereumVersionDockerImage extends VersionDockerImage {
  consensusImage?: string
  validatorImage?: string
  passwordPath?: string
}

export interface ValidatorObject {
  keystore: string
  pubkey: string
  status?: string
}

export interface Validators {
  [key: number]: ValidatorObject
}

export interface DepositKeyInterface {
  pubkey: string;
  withdrawal_credentials: string;
  amount: number;
  signature: string;
  deposit_message_root: string;
  deposit_data_root: string;
  fork_version: string;
  deposit_cli_version: string;
}

export interface Services {
  [key: string]: ContainerService
}

export interface ContainerService {
  container_name: string
  image:          string
  restart:        string
  deploy: {
    resources: {
      limits: {
        cpus: string
        memory: string
      }
    }
  }
  command: string
  user?: string
  ports: string[]
  volumes: string[]
  networks: string[]
  secrets?:  string[]
}

export class Ethereum extends EthereumPreMerge {

  static versions(client: string, networkType: string): EthereumVersionDockerImage[] {
    client = client || Ethereum.clients[0];
    let versions: EthereumVersionDockerImage[];
    const consensusFlag = true;
    switch(client) {
      case NodeClient.GETH:
        versions = [
          {
            version: '1.13.14',
            clientVersion: '1.13.14',
            image: 'ethereum/client-go:v1.13.14',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.13.11',
            clientVersion: '1.13.11',
            image: 'ethereum/client-go:v1.13.11',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.13.4',
            clientVersion: '1.13.4',
            image: 'ethereum/client-go:v1.13.4',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.12.2',
            clientVersion: '1.12.2',
            image: 'ethereum/client-go:v1.12.2',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.11.0',
            clientVersion: '1.11.0',
            image: 'ethereum/client-go:v1.11.0',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.26',
            clientVersion: '1.10.26',
            image: 'ethereum/client-go:v1.10.26',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.25',
            clientVersion: '1.10.25',
            image: 'ethereum/client-go:v1.10.25',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
            async upgrade(data: EthereumCryptoNodeData): Promise<boolean> {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
        ];
        break;
      case NodeClient.NETHERMIND:
        versions = [
          {
            version: '1.25.4',
            clientVersion: '1.25.4',
            image: 'nethermind/nethermind:1.25.4',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.25.3',
            clientVersion: '1.25.3',
            image: 'nethermind/nethermind:1.25.3',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.21.1',
            clientVersion: '1.21.1',
            image: 'nethermind/nethermind:1.21.1',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.20.4',
            clientVersion: '1.20.4',
            image: 'nethermind/nethermind:1.20.4',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.19.3',
            clientVersion: '1.19.3',
            image: 'nethermind/nethermind:1.19.3',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.18.2',
            clientVersion: '1.18.2',
            image: 'nethermind/nethermind:1.18.2',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.17.3',
            clientVersion: '1.17.3',
            image: 'nethermind/nethermind:1.17.3',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.14.7',
            clientVersion: '1.14.7',
            image: 'nethermind/nethermind:1.14.7',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.14.5',
            clientVersion: '1.14.5',
            image: 'nethermind/nethermind:1.14.5',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
          {
            version: '1.14.0',
            clientVersion: '1.14.0',
            image: 'nethermind/nethermind:1.14.0',
            consensusImage: '',
            validatorImage: '',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --configsDirectory ${this.configDir} --config ${network.toLowerCase()}`;
            },
          },
        ];
        break;
      case NodeClient.ERIGON:
        versions = [
          {
            version: '2.58.2',
            clientVersion: '2.58.2',
            image: 'thorax/erigon:v2.58.2',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.57.1',
            clientVersion: '2.57.1',
            image: 'thorax/erigon:v2.57.1',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: true,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
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
              const externalclIdx = splitConfig
                .findIndex(l => /^externalcl/.test(l.trim()));
              if(externalclIdx >= 0) {
                const newSplitConfig = [
                  ...splitConfig.slice(0, externalclIdx),
                  ...splitConfig.slice(externalclIdx + 1),
                ];
                const newConfig = newSplitConfig.join('\n');
                await fs.writeFile(configPath, newConfig, 'utf8');
              }
              return true;
            },
          },
          // {
          //   version: '2.53.4',
          //   clientVersion: '2.53.4',
          //   image: 'thorax/erigon:v2.53.4',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.52.5',
          //   clientVersion: '2.52.5',
          //   image: 'thorax/erigon:v2.52.5',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.51.0',
          //   clientVersion: '2.51.0',
          //   image: 'thorax/erigon:v2.51.0',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.50.2',
          //   clientVersion: '2.50.2',
          //   image: 'thorax/erigon:v2.50.2',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.49.3',
          //   clientVersion: '2.49.3',
          //   image: 'thorax/erigon:v2.49.3',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.48.1',
          //   clientVersion: '2.48.1',
          //   image: 'thorax/erigon:v2.48.1',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.47.0',
          //   clientVersion: '2.47.0',
          //   image: 'thorax/erigon:v2.47.0',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.46.0',
          //   clientVersion: '2.46.0',
          //   image: 'thorax/erigon:v2.46.0',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.45.3',
          //   clientVersion: '2.45.3',
          //   image: 'thorax/erigon:v2.45.3',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.44.0',
          //   clientVersion: '2.44.0',
          //   image: 'thorax/erigon:v2.44.0',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          // {
          //   version: '2.43.1',
          //   clientVersion: '2.43.1',
          //   image: 'thorax/erigon:v2.43.1',
          //   dataDir: '/erigon/data',
          //   walletDir: '/erigon/keystore',
          //   configDir: '/erigon/config',
          //   networks: [NetworkType.MAINNET, NetworkType.GOERLI],
          //   breaking: false,
          //   generateRuntimeArgs(data: EthereumCryptoNodeData): string {
          //     const { network = '' } = data;
          //     return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
          //   },
          // },
          {
            version: '2.42.0',
            clientVersion: '2.42.0',
            image: 'thorax/erigon:v2.42.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.41.0',
            clientVersion: '2.41.0',
            image: 'thorax/erigon:v2.41.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.40.1',
            clientVersion: '2.40.1',
            image: 'thorax/erigon:v2.40.1',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: true,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.39.0',
            clientVersion: '2.39.0',
            image: 'thorax/erigon:v2.39.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.38.1',
            clientVersion: '2.38.1',
            image: 'thorax/erigon:v2.38.1',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.37.0',
            clientVersion: '2.37.0',
            image: 'thorax/erigon:v2.37.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.36.1',
            clientVersion: '2.36.1',
            image: 'thorax/erigon:v2.36.1',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.32.0',
            clientVersion: '2.32.0',
            image: 'thorax/erigon:v2.32.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.31.0',
            clientVersion: '2.31.0',
            image: 'thorax/erigon:v2.31.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.30.0',
            clientVersion: '2.30.0',
            image: 'thorax/erigon:v2.30.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
          {
            version: '2.29.0',
            clientVersion: '2.29.0',
            image: 'icculp/erigon:v2.29.0',
            dataDir: '/erigon/data',
            walletDir: '/erigon/keystore',
            configDir: '/erigon/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
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
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = '' } = data;
              return ` erigon --config=${path.join(this.configDir, Ethereum.configName(data))}  `;
            },
          },
        ];
        break;
      case NodeClient.PRYSM:
        versions = [
          {
            version: '5.0.1',
            clientVersion: '5.0.1',
            image: 'prysmaticlabs/prysm-beacon-chain:v5.0.1',
            consensusImage: 'prysmaticlabs/prysm-beacon-chain:v5.0.1',
            validatorImage: 'prysmaticlabs/prysm-validator:v5.0.1',
            //passwordPath: '/.hidden/pass.pwd',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet'} = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()}`;
            },
          },
          {
            version: '4.2.0',
            clientVersion: '4.2.0',
            image: 'prysmaticlabs/prysm-beacon-chain:v4.2.0',
            consensusImage: 'prysmaticlabs/prysm-beacon-chain:v4.2.0',
            validatorImage: 'prysmaticlabs/prysm-validator:v4.2.0',
            //passwordPath: '/.hidden/pass.pwd',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet'} = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()}`;
            },
          },
          {
            version: '4.1.1',
            clientVersion: '4.1.1',
            image: 'prysmaticlabs/prysm-beacon-chain:v4.1.1',
            consensusImage: 'prysmaticlabs/prysm-beacon-chain:v4.1.1',
            validatorImage: 'prysmaticlabs/prysm-validator:v4.1.1',
            //passwordPath: '/.hidden/pass.pwd',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet'} = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()}`;
            },
          },
          {
            version: '4.0.1',
            clientVersion: '4.0.1',
            image: 'prysmaticlabs/prysm-beacon-chain:v4.0.1',
            consensusImage: 'prysmaticlabs/prysm-beacon-chain:v4.0.1',
            validatorImage: 'prysmaticlabs/prysm-validator:v4.0.1',
            //passwordPath: '/.hidden/pass.pwd',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet'} = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()}`;
            },
          },
          {
            version: '3.2.0',
            clientVersion: '3.2.0',
            image: 'prysmaticlabs/prysm-beacon-chain:v3.2.0',
            consensusImage: 'prysmaticlabs/prysm-beacon-chain:v3.2.0',
            validatorImage: 'prysmaticlabs/prysm-validator:v3.2.0',
            //passwordPath: '/.hidden/pass.pwd',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet'} = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()}`;
            },
          },
          {
            version: '3.1.2',
            clientVersion: '3.1.2',
            image: 'prysmaticlabs/prysm-beacon-chain:v3.1.2',
            consensusImage: 'prysmaticlabs/prysm-beacon-chain:v3.1.2',
            validatorImage: 'prysmaticlabs/prysm-validator:v3.1.2',
            //passwordPath: '/.hidden/pass.pwd',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet'} = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()}`;
            },
          },
          {
            version: '3.1.1',
            clientVersion: '3.1.1',
            image: 'prysmaticlabs/prysm-beacon-chain:v3.1.1',
            consensusImage: 'rburgett/prysm-beacon-chain:v3.1.1',
            validatorImage: 'prysmaticlabs/prysm-validator:v3.1.1',
            //passwordPath: '/.hidden/pass.pwd',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet' } = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()} `;
            },
          },
          {
            version: '3.1.0',
            clientVersion: '3.1.0',
            image: 'prysmaticlabs/prysm-beacon-chain:v3.1.0',
            consensusImage: '',
            validatorImage: '',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.TESTNET],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { network = 'mainnet' } = data;
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} --${network.toLowerCase()} `;
            },
          },
        ];
        break;
      case NodeClient.TEKU:
        versions = [
          {
            version: '22.12.0',
            clientVersion: '22.12.0',
            image: 'consensys/teku:22.12.0',
            dataDir: '/opt/teku/data',
            walletDir: '/opt/teku/keystore',
            configDir: '/opt/teku/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} `;
            },
          },
          {
            version: '22.11.0',
            clientVersion: '22.11.0',
            image: 'consensys/teku:22.11.0',
            dataDir: '/opt/teku/data',
            walletDir: '/opt/teku/keystore',
            configDir: '/opt/teku/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} `;
            },
          },
          {
            version: '22.10.2',
            clientVersion: '22.10.2',
            image: 'icculp/teku:22.10.2',
            dataDir: '/opt/teku/data',
            walletDir: '/opt/teku/keystore',
            configDir: '/opt/teku/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} `;
            },
          },
        ];
        break;
      case NodeClient.NIMBUS:
        versions = [
          {
            version: '22.12.0',
            clientVersion: '22.12.0',
            image: 'statusim/nimbus-eth2:multiarch-v22.12.0',
            dataDir: '/var/lib/data',
            walletDir: '/var/lib/keystore',
            configDir: '/var/lib/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} `;
            },
          },
          {
            version: '22.11.0',
            clientVersion: '22.11.0',
            image: 'statusim/nimbus-eth2:multiarch-v22.11.0',
            dataDir: '/var/lib/data',
            walletDir: '/var/lib/keystore',
            configDir: '/var/lib/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              //const checkpointSyncUrl = data.network == NetworkType.MAINNET ? 'https://beaconstate.ethstaker.cc' : 'https://goerli.beaconstate.ethstaker.cc'
              //--trustedNodeSync --trusted-node-url=${checkpointSyncUrl}
              // nimbusTustedNodeSync(data: EthereumCryptoNodeData): string {
              // docker run -u root  -v /home/np/eth/data:/var/lib/data  -it statusim/nimbus-eth2:multiarch-v22.11.0 trustedNodeSync --network:goerli --data-dir=/var/lib/data --reindex=true --trusted-node-url=https://goerli.beaconstate.ethstaker.cc
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))}  `;
            },
          },
          {
            version: '22.10.1',
            clientVersion: '22.10.1',
            image: 'statusim/nimbus-eth2:multiarch-v22.10.1',
            dataDir: '/var/lib/data',
            walletDir: '/var/lib/keystore',
            configDir: '/var/lib/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Ethereum.configName(data, consensusFlag))} `;
            },
          },
        ];
        break;
      case NodeClient.LIGHTHOUSE:
        versions = [
          {
            version: '3.3.0',
            clientVersion: '3.3.0',
            image: 'sigp/lighthouse:v3.3.0',
            validatorImage: 'sigp/lighthouse:v3.3.0',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI, NetworkType.XDAI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { consensusRPCPort, consensusPeerPort, network, id, rpcPort, authPort } = data;
              let network_ = network || '';
              let  checkpointSyncUrl = '';
              let bootnodes = ''
              if (network == NetworkType.MAINNET) {
                checkpointSyncUrl = 'https://beaconstate.ethstaker.cc';
              } else if (network === NetworkType.GOERLI) {
                checkpointSyncUrl = 'https://goerli.beaconstate.ethstaker.cc';
              } else if (network === NetworkType.XDAI) {
                checkpointSyncUrl = 'https://checkpoint.gnosischain.com';
                network_ = 'gnosis';
                bootnodes = `--boot-nodes=enr:-Ly4QClooKhmB409-xLE52rTmC2h9kZBO_VFXR-kjqLDdduuZoxsjfwTxa1jscQMBpqmezG_JCwPpEzEYRM_1UCy-0gCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKXoiruJc2VjcDI1NmsxoQLLYztVAaOL2dhsQf884Vth9ro6n9p2yj-osPfZ0L_NwYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QHO5_3Zuosjt9IJQF3ovGroSWyB4rMZFUulOl5R5PkjcfVwtYewEp2TvUpo9tvHYMGKpDxgAYmjjTJcGasqn9uoCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhI_GnBiJc2VjcDI1NmsxoQJqvGdusfukoXNx3F84umajVgkfVs0wasHeY45qcYgwf4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QPd8v1jzDOHuEAEJ-NPgbLgRRbsuuz4KZOSZ2YiIaD0dQ-BMbbzEw0Cix5wst0suFVrsrB73dg0_980zpbKKzzEBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhJ_f1T2Jc2VjcDI1NmsxoQNdZWlOxiBbJltPxilQgdllvE_cNF6sC1bpyRUyWegVjohzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QAOrFTIBlS__dwh0hhMLcGB-mbRTgMJc1P4MfMyd15-dX75_TBq7RsqWMLsZzdidoU41zO0fvI8-w7N8dHrpA54Bh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-woiJc2VjcDI1NmsxoQKeJ-BUNBGaVYX1MgnAsvjgJpGXVKgEMZa1_FMG8fTYl4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QM0mWWtb978oZpY46_DVEY9SOkyDKprDlu6NyI6cjRX0TDYGp9txkyREyRw3mIkXWFDsdhONUZqKzjD09lp3iLIBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-wMOJc2VjcDI1NmsxoQNXBYeo4Oa9Hksc247JWokwgpZAJzZxWMMK1KG3UYl4w4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QDnJWKfiGm6U6SyLr8r-BfM6zHlI90VPsgbxiXb6GhIUVcDmeGw_IRxLpUAelnu2sH8TtF9uenfIGdAshoUZHAUBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKdj0Q6Jc2VjcDI1NmsxoQIrmmOVYy87sV-n8x8QxfCKLsf_eKqwk6Rl5Gj-YLV8wYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-L24QJHzedzjOM6Xm53qSdrbP635LvqpxFCJy_2T84rZvVVjV81kS_kRKp7vV_PFPS2EHdSzpXtDMJCugvzdhjRZeGkGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhIm45FOJc2VjcDI1NmsxoQPHxbRx1Ev72MVVUergKeLznxrchLhB3lK9ljWCbCuGWYhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-L24QK00qalnMGv7PVg5k9Z7OjPFhIFoHLm6SDP8DjKOgFO5aUHzCqecoA9S3Y_0nI8mOF8sF1mYqYEE7byacE1Vq6YGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKRcYG-Jc2VjcDI1NmsxoQPUtWI-6bkId_18Hy0KCautFQ5GJD-f2cgYCqNS5EekRIhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-L24QPdWmlPHi-0fQKptAjtkhKG50novgUHWeP5amyi_lGSWcQPAahWl7Ci3kW2p1Sd6WRtqlgkxSyvc6wioeaQl9ZIGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-xGiJc2VjcDI1NmsxoQLNCuDR6ik6JcTW8uAsoPn6AMgtNvGq65kCnJmA2HY2JIhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-L24QICiK4pSRAOgkO7R3yQVbjJXGVt1vbdvXsom0yA-UqlMIHO98f8tZyEKbz0lrgrdy89Vw_agSKzuGS7Hgi3QsygGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhJ_f1aaJc2VjcDI1NmsxoQKyGQswAJ5pJaPF9WRpGU4Lp8CdxiSlm8AHJsr1naz_7YhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-KG4QKWOgedErRLsanl1AUjTFnHB-RO9OsyFP-vtSrX2VGxRBdvoJVrzBJwgGYLIBiDjqy0eYJ2r8ZosAjkWhQ02koUGhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39WdiXNlY3AyNTZrMaEDYAuZlJpKwWdGtbSrVgy6N5sdMjehVglGMGGkBCFg_VeDdGNwgiMog3VkcIIjKA,enr:-KG4QBart9YQV5Ju3EMxUUnJ0ntgYf7J6jDbEPySiR7R8gJ9DcTp22gArHqWSMQVyt0-TMnuZrZQCprcaka5J8B9JN8GhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39G5iXNlY3AyNTZrMaED13MHlUcbr4978YYNRurZtykey8gTY_O5pQ4a427ZICuDdGNwgiMog3VkcIIjKA,enr:-KG4QLk-EkZCAjhMaBSlB4r6Icrz137hIx6WXg5AKIXQl9vkPt876WxIhzu8dVPCLVfaPzjAsIjXeBUPy2E3VH4QEuEGhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39n5iXNlY3AyNTZrMaECtocMlfvwxqouGi13SSdG6Tkn3shkyBQt1BIpF0fhXc-DdGNwgiMog3VkcIIjKA,enr:-KG4QDXI2zubDpp7QowlafGwwTLu4w-gFztFYNnA6_I0vrpaS9bXQydY_Gh8Dc6c7cy9SHEi56HRfle9jkKIbSRQ2B8GhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39WiiXNlY3AyNTZrMaECZ2_0tLZ9kb0Wn-lVNcZEyhVG9dmXX_xzQXQq24sdbZiDdGNwgiMog3VkcIIjKA,enr:-LK4QPnudCfJYvcmV-LjJBU5jexY3QTdC1PepWK08OHb4w_BJ3OgFbh0Bc2nb1WRK6p2CBNOPAixpPrtAvmNQPgegDgBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpBW_bXgAQAAZP__________gmlkgnY0gmlwhJO2zMWJc2VjcDI1NmsxoQKk8-B9o94CY2UUK2bxPpl-T_yHmTtE7rAPaT26M4w09YN0Y3CCIyiDdWRwgiMo,enr:-LK4QArhQjC_S3CwptV7balWpNP5IVKweAqZzvq93vz_zN_ZSruOxBU5ECgqOBUFHO1nYUveOYVeiEKswg637rOURDABh2F0dG5ldHOIAAAAAAAAAACEZXRoMpBW_bXgAQAAZP__________gmlkgnY0gmlwhIm4t0GJc2VjcDI1NmsxoQIj9iJm4h7OAhhCoUcqfn41_fj9F7UfKnISj_-xqKH834N0Y3CCIyiDdWRwgiMo,enr:-Ly4QMU1y81COwm1VZgxGF4_eZ21ub9-GHF6dXZ29aEJ0oZpcV2Rysw-viaEKfpcpu9ZarILJLxFZjcKOjE0Sybs3MQBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhANLnx-Jc2VjcDI1NmsxoQKoaYT8I-wf2I_f_ii6EgoSSXj5T3bhiDyW-7ZLsY3T64hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QJcPfzPTwhknVlYmCMYo1vtOqItLLV9iiydSuMYoCcJ6G38V6JiJaRNQUTR-1sivBsJIESP9A4KhoO_k9vOR9ZoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhBLGgjaJc2VjcDI1NmsxoQPKKRjNBuhorFa1FbCJ8xgkbhu5Jm-uYyafBiLIN-mIiYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QLjZUWdqUO_RwyDqCAccIK5-MbLRD6A2c7oBuVbBgBnWDkEf0UKJVAaJqi2pO101WVQQLYSnYgz1Q3pRhYdrlFoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhANA8sSJc2VjcDI1NmsxoQK4TC_EK1jSs0VVPUpOjIo1rhJmff2SLBPFOWSXMwdLVYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QKwX2rTFtKWKQHSGQFhquxsxL1jewO8JB1MG-jgHqAZVFWxnb3yMoQqnYSV1bk25-_jiLuhIulxar3RBWXEDm6EBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhAN-qZeJc2VjcDI1NmsxoQI7EPGMpecl0QofLp4Wy_lYNCCChUFEH6kY7k-oBGkPFIhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA`
              }
              return ` lighthouse beacon --http --eth1 --checkpoint-sync-url="${checkpointSyncUrl}" --datadir=/root/data --execution-endpoint=http://${id}:${authPort} --execution-jwt=/root/config/jwt.hex --port=${consensusPeerPort} --http-address=0.0.0.0 --http-allow-origin=* --http-port=${consensusRPCPort} --network=${network_.toLowerCase()}  ${bootnodes}`;
            },
          },
          {
            version: '3.2.1',
            clientVersion: '3.2.1',
            image: 'sigp/lighthouse:v3.2.1',
            validatorImage: 'sigp/lighthouse:v3.2.1',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET, NetworkType.GOERLI],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { consensusRPCPort, consensusPeerPort, network, id, rpcPort, authPort } = data;
              const checkpointSyncUrl = network == NetworkType.MAINNET ? 'https://beaconstate.ethstaker.cc' : 'https://goerli.beaconstate.ethstaker.cc';
              return ` lighthouse beacon --http --eth1 --checkpoint-sync-url="${checkpointSyncUrl}" --datadir=/root/data --execution-endpoint=http://${id}:${authPort} --execution-jwt=/root/config/jwt.hex --port=${consensusPeerPort} --http-address=0.0.0.0 --http-allow-origin=* --http-port=${consensusRPCPort} --network=${network?.toLowerCase()}  `;
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
    NodeClient.NETHERMIND,
    NodeClient.ERIGON,
  ];

  static consensusClients = [
    NodeClient.PRYSM,
    NodeClient.TEKU,
    NodeClient.NIMBUS,
    NodeClient.LIGHTHOUSE,
  ];

  static nodeTypes = [
    NodeType.FULL,
    NodeType.ARCHIVAL,
  ];

  static networkTypes = [
    NetworkType.MAINNET,
    //NetworkType.RINKEBY,
    NetworkType.GOERLI,
    // NetworkType.XDAI,
  ];

  static roles = [
    Role.NODE,
    Role.VALIDATOR,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 8755,
    [NetworkType.RINKEBY]: 18545,
    [NetworkType.GOERLI]: 16545,
    [NetworkType.XDAI]: 8755,
  }; // 8545

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8756,
    [NetworkType.RINKEBY]: 18546,
    [NetworkType.GOERLI]: 16546,
    [NetworkType.XDAI]: 8756,
  }; // 30303

  static defaultAuthPort = {
    [NetworkType.MAINNET]: 8551,
    [NetworkType.GOERLI]: 7651,
    [NetworkType.XDAI]: 8551,
  };

  static defaultConsensusRPCPort = {
    [NetworkType.MAINNET]: 8757,
    [NetworkType.GOERLI]: 16757,
    [NetworkType.XDAI]: 8757,
  }; // 3500 grpc query api default --grpc-gateway-port (host must be enabled, cors modified), 4000 validator grpc default --rpc

  static defaultConsensusPeerPort = {
    [NetworkType.MAINNET]: 8758,
    [NetworkType.GOERLI]: 16758,
    [NetworkType.XDAI]: 8758,
  }; // 1300tcp and 1200udp defaults (technical debt again), but can be same. need to open both tcp and udp

  static defaultValidatorRPCPort = {
    [NetworkType.MAINNET]: 7000,
    [NetworkType.GOERLI]: 16000,
    [NetworkType.XDAI]: 7000,
  }; // validator grpc gateway

  static defaultCPUs = 8;

  static defaultMem = 16384;

  static generateConfig(client: Ethereum|string = Ethereum.clients[0], network = NetworkType.MAINNET, peerPort = Ethereum.defaultPeerPort[NetworkType.MAINNET], rpcPort = Ethereum.defaultRPCPort[NetworkType.MAINNET], consensus = false): string {
    let clientStr: string;
    let authPort = 0;
    let id, role, address, validatorRPCPort = '';
    let checkpointSyncUrl = '';
    if(typeof client === 'string') {
      clientStr = client;
    } else {
      if (consensus) {
        clientStr = client.consensusClient;
        peerPort = client.consensusPeerPort;
        rpcPort = client.consensusRPCPort;
      } else {
        clientStr = client.client;
        peerPort = client.peerPort;
        rpcPort = client.rpcPort;
      }
      network = client.network;
      authPort = client.authPort;
      id = client.id;
      role = client.role;
      address = client.eth1Address;
      validatorRPCPort = client.validatorRPCPort.toString();
    }
    authPort = authPort || Ethereum.defaultAuthPort[network];
    let config = '';
    switch (network) { // prysm and nimbus can use this url
      case NetworkType.GOERLI:
        checkpointSyncUrl = 'https://goerli.beaconstate.ethstaker.cc';
        break;
      case NetworkType.MAINNET:
        checkpointSyncUrl = 'https://beaconstate.ethstaker.cc';
        break;
    }
    switch(clientStr) {
      case NodeClient.GETH:
        switch(network) {
          case NetworkType.MAINNET:
            config = coreConfig.replace('{{NETWORK_ID}}', '1');
            break;
          case NetworkType.GOERLI:
            config = coreConfig.replace('{{NETWORK_ID}}', '5');
            break;
        }
        break;
      case NodeClient.NETHERMIND:
        switch(network) {
          case NetworkType.MAINNET:
            config = nethermindConfig.mainnet;
            break;
          case NetworkType.GOERLI:
            config = nethermindConfig.goerli;
              break;
          case NetworkType.RINKEBY:
            config = nethermindConfig.rinkeby;
            break;
          case NetworkType.XDAI:
              config = nethermindConfig.xdai;
              break;
          }
        break;
      case NodeClient.ERIGON:
        config = erigonConfig.replace('{{NETWORK}}', network.toLowerCase());
        break;
      case NodeClient.PRYSM: { // /\ execution \/ consensus
        const genesisBeaconApiUrl = checkpointSyncUrl;
        const prysmValidatorPort = '4000';
        let networkId = '1'; //mainnet
        let chainId = '1';
        if(network === NetworkType.GOERLI) {
          networkId = '5';
          chainId = '5';
        }
        config = prysmConfig.beacon
          .replace('{{CHECKPOINT_SYNC_URL}}', checkpointSyncUrl)
          .replace('{{GENESIS_BEACON_API_URL}}', genesisBeaconApiUrl)
          .replace('{{EXEC}}', `http://${id}:${authPort.toString(10)}`)
          .replace('{{VALIDATOR_RPC_PORT}}', prysmValidatorPort) // not to be confused with grpc-gateway, prysm only...
          .replace('{{NETWORK_ID}}', networkId)
          .replace('{{CHAIN_ID}}', chainId);
        break;
      }
      case NodeClient.TEKU: {
        let initialState: string;
        config = tekuConfig.replace('{{EXEC}}', `http://${id}:${authPort.toString(10)}`)
        if(network === NetworkType.GOERLI) {
          initialState = 'https://goerli.beaconstate.info/eth/v2/debug/beacon/states/finalized';
        } else if (network === NetworkType.MAINNET) { // MAINNET
          initialState = 'https://beaconstate.info/eth/v2/debug/beacon/states/finalized';
        } else if (network === NetworkType.XDAI) {
          initialState = 'https://checkpoint.gnosischain.com';
          network = 'gnosis';
          config += '\np2p-discovery-bootnodes: ["enr:-Ly4QClooKhmB409-xLE52rTmC2h9kZBO_VFXR-kjqLDdduuZoxsjfwTxa1jscQMBpqmezG_JCwPpEzEYRM_1UCy-0gCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKXoiruJc2VjcDI1NmsxoQLLYztVAaOL2dhsQf884Vth9ro6n9p2yj-osPfZ0L_NwYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QHO5_3Zuosjt9IJQF3ovGroSWyB4rMZFUulOl5R5PkjcfVwtYewEp2TvUpo9tvHYMGKpDxgAYmjjTJcGasqn9uoCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhI_GnBiJc2VjcDI1NmsxoQJqvGdusfukoXNx3F84umajVgkfVs0wasHeY45qcYgwf4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QPd8v1jzDOHuEAEJ-NPgbLgRRbsuuz4KZOSZ2YiIaD0dQ-BMbbzEw0Cix5wst0suFVrsrB73dg0_980zpbKKzzEBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhJ_f1T2Jc2VjcDI1NmsxoQNdZWlOxiBbJltPxilQgdllvE_cNF6sC1bpyRUyWegVjohzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QAOrFTIBlS__dwh0hhMLcGB-mbRTgMJc1P4MfMyd15-dX75_TBq7RsqWMLsZzdidoU41zO0fvI8-w7N8dHrpA54Bh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-woiJc2VjcDI1NmsxoQKeJ-BUNBGaVYX1MgnAsvjgJpGXVKgEMZa1_FMG8fTYl4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QM0mWWtb978oZpY46_DVEY9SOkyDKprDlu6NyI6cjRX0TDYGp9txkyREyRw3mIkXWFDsdhONUZqKzjD09lp3iLIBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-wMOJc2VjcDI1NmsxoQNXBYeo4Oa9Hksc247JWokwgpZAJzZxWMMK1KG3UYl4w4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QDnJWKfiGm6U6SyLr8r-BfM6zHlI90VPsgbxiXb6GhIUVcDmeGw_IRxLpUAelnu2sH8TtF9uenfIGdAshoUZHAUBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKdj0Q6Jc2VjcDI1NmsxoQIrmmOVYy87sV-n8x8QxfCKLsf_eKqwk6Rl5Gj-YLV8wYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-L24QJHzedzjOM6Xm53qSdrbP635LvqpxFCJy_2T84rZvVVjV81kS_kRKp7vV_PFPS2EHdSzpXtDMJCugvzdhjRZeGkGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhIm45FOJc2VjcDI1NmsxoQPHxbRx1Ev72MVVUergKeLznxrchLhB3lK9ljWCbCuGWYhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg","enr:-L24QK00qalnMGv7PVg5k9Z7OjPFhIFoHLm6SDP8DjKOgFO5aUHzCqecoA9S3Y_0nI8mOF8sF1mYqYEE7byacE1Vq6YGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKRcYG-Jc2VjcDI1NmsxoQPUtWI-6bkId_18Hy0KCautFQ5GJD-f2cgYCqNS5EekRIhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg","enr:-L24QPdWmlPHi-0fQKptAjtkhKG50novgUHWeP5amyi_lGSWcQPAahWl7Ci3kW2p1Sd6WRtqlgkxSyvc6wioeaQl9ZIGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-xGiJc2VjcDI1NmsxoQLNCuDR6ik6JcTW8uAsoPn6AMgtNvGq65kCnJmA2HY2JIhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg","enr:-L24QICiK4pSRAOgkO7R3yQVbjJXGVt1vbdvXsom0yA-UqlMIHO98f8tZyEKbz0lrgrdy89Vw_agSKzuGS7Hgi3QsygGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhJ_f1aaJc2VjcDI1NmsxoQKyGQswAJ5pJaPF9WRpGU4Lp8CdxiSlm8AHJsr1naz_7YhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg","enr:-KG4QKWOgedErRLsanl1AUjTFnHB-RO9OsyFP-vtSrX2VGxRBdvoJVrzBJwgGYLIBiDjqy0eYJ2r8ZosAjkWhQ02koUGhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39WdiXNlY3AyNTZrMaEDYAuZlJpKwWdGtbSrVgy6N5sdMjehVglGMGGkBCFg_VeDdGNwgiMog3VkcIIjKA","enr:-KG4QBart9YQV5Ju3EMxUUnJ0ntgYf7J6jDbEPySiR7R8gJ9DcTp22gArHqWSMQVyt0-TMnuZrZQCprcaka5J8B9JN8GhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39G5iXNlY3AyNTZrMaED13MHlUcbr4978YYNRurZtykey8gTY_O5pQ4a427ZICuDdGNwgiMog3VkcIIjKA","enr:-KG4QLk-EkZCAjhMaBSlB4r6Icrz137hIx6WXg5AKIXQl9vkPt876WxIhzu8dVPCLVfaPzjAsIjXeBUPy2E3VH4QEuEGhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39n5iXNlY3AyNTZrMaECtocMlfvwxqouGi13SSdG6Tkn3shkyBQt1BIpF0fhXc-DdGNwgiMog3VkcIIjKA","enr:-KG4QDXI2zubDpp7QowlafGwwTLu4w-gFztFYNnA6_I0vrpaS9bXQydY_Gh8Dc6c7cy9SHEi56HRfle9jkKIbSRQ2B8GhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39WiiXNlY3AyNTZrMaECZ2_0tLZ9kb0Wn-lVNcZEyhVG9dmXX_xzQXQq24sdbZiDdGNwgiMog3VkcIIjKA","enr:-LK4QPnudCfJYvcmV-LjJBU5jexY3QTdC1PepWK08OHb4w_BJ3OgFbh0Bc2nb1WRK6p2CBNOPAixpPrtAvmNQPgegDgBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpBW_bXgAQAAZP__________gmlkgnY0gmlwhJO2zMWJc2VjcDI1NmsxoQKk8-B9o94CY2UUK2bxPpl-T_yHmTtE7rAPaT26M4w09YN0Y3CCIyiDdWRwgiMo","enr:-LK4QArhQjC_S3CwptV7balWpNP5IVKweAqZzvq93vz_zN_ZSruOxBU5ECgqOBUFHO1nYUveOYVeiEKswg637rOURDABh2F0dG5ldHOIAAAAAAAAAACEZXRoMpBW_bXgAQAAZP__________gmlkgnY0gmlwhIm4t0GJc2VjcDI1NmsxoQIj9iJm4h7OAhhCoUcqfn41_fj9F7UfKnISj_-xqKH834N0Y3CCIyiDdWRwgiMo","enr:-Ly4QMU1y81COwm1VZgxGF4_eZ21ub9-GHF6dXZ29aEJ0oZpcV2Rysw-viaEKfpcpu9ZarILJLxFZjcKOjE0Sybs3MQBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhANLnx-Jc2VjcDI1NmsxoQKoaYT8I-wf2I_f_ii6EgoSSXj5T3bhiDyW-7ZLsY3T64hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QJcPfzPTwhknVlYmCMYo1vtOqItLLV9iiydSuMYoCcJ6G38V6JiJaRNQUTR-1sivBsJIESP9A4KhoO_k9vOR9ZoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhBLGgjaJc2VjcDI1NmsxoQPKKRjNBuhorFa1FbCJ8xgkbhu5Jm-uYyafBiLIN-mIiYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QLjZUWdqUO_RwyDqCAccIK5-MbLRD6A2c7oBuVbBgBnWDkEf0UKJVAaJqi2pO101WVQQLYSnYgz1Q3pRhYdrlFoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhANA8sSJc2VjcDI1NmsxoQK4TC_EK1jSs0VVPUpOjIo1rhJmff2SLBPFOWSXMwdLVYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA","enr:-Ly4QKwX2rTFtKWKQHSGQFhquxsxL1jewO8JB1MG-jgHqAZVFWxnb3yMoQqnYSV1bk25-_jiLuhIulxar3RBWXEDm6EBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhAN-qZeJc2VjcDI1NmsxoQI7EPGMpecl0QofLp4Wy_lYNCCChUFEH6kY7k-oBGkPFIhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA",]'
        } else {
          initialState = '';
        }
        config = config.replace('{{INITIAL_STATE}}', initialState);
        if (role == Role.VALIDATOR) {
        config += tekuValidatorConfig
          .replace('{{ETH1_ADDRESS}}', address || '')
          .replace('{{VALIDATOR_RPC_PORT}}', validatorRPCPort);
        }
        break;
      }
      case NodeClient.NIMBUS: {
        config = nimbusConfig
          .replace('{{EXEC}}', `http://${id}:${authPort.toString(10)}`)
          .replace('{{CHECKPOINT_SYNC_URL}}', checkpointSyncUrl)
          .replace('{{NETWORK}}', network.toLowerCase());
        if (role == Role.VALIDATOR) {
            config += nimbusValidatorConfig
              .replace('{{ETH1_ADDRESS}}', address || '');
              //.replace('{{VALIDATOR_RPC_PORT}}', validatorRPCPort)
          }
        break;
      }
      case NodeClient.LIGHTHOUSE: {
        config = ''; //lighthouseConfig;
        if (role == Role.VALIDATOR) {
          config += '';
        }
        break;
      }
      default:
        return '';
    }
    return config
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10))
      .replace('{{RPC_PORT}}', rpcPort.toString(10))
      .replace('{{AUTH_PORT}}', authPort.toString(10))
      .replace('{{NETWORK}}', network.toLowerCase())
      .trim();
  }

  static configName(data: EthereumCryptoNodeData, consensus = false): string {
    const { network = '', client, consensusClient } = data;
    switch(consensus ? consensusClient : client) {
      case NodeClient.NETHERMIND: {
        return network.toLowerCase() + '.cfg';
      }
      case NodeClient.PRYSM:
          return 'prysm.yaml';
      case NodeClient.TEKU:
        return 'teku.yaml';
      case NodeClient.NIMBUS:
        return 'nimbus.toml';
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
  consensusVersion: string;
  archival = false;
  dockerImage: string;
  network: string;
  peerPort: number;
  rpcPort: number;
  rpcUsername: string;
  rpcPassword: string;
  client: string;
  consensusClient: string;
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
  validatorRPCPort: number;
  passwordPath = '';
  eth1Address = '';
  validators: Validators; //| Array<number>;
  mnemonicEncrypted: EncryptedKeystore;
  jwt: string;


  constructor(data: EthereumCryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Ethereum.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Ethereum.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client ? data.client : this.network === NetworkType.XDAI ? NodeClient.NETHERMIND : Ethereum.clients[0];
    this.consensusClient = data.consensusClient ? data.consensusClient : this.network === NetworkType.XDAI ? NodeClient.LIGHTHOUSE : Ethereum.consensusClients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    const tmpdir = os.tmpdir();
    this.dataDir = data.dataDir || this.dataDir || path.join(tmpdir, uuid());
    this.walletDir = data.walletDir || this.walletDir || path.join(tmpdir, uuid());
    this.configDir = data.configDir || this.configDir || path.join(tmpdir, uuid());
    this.createdAt = data.createdAt || this.createdAt;
    this.updatedAt = data.updatedAt || this.updatedAt;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Ethereum.versions(this.client, this.network);
    const consensusVersions = Ethereum.versions(this.consensusClient, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    this.consensusVersion = data.consensusVersion || (consensusVersions && consensusVersions[0] ? consensusVersions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    const consensusVersionObj = consensusVersions.find(v => v.version === this.consensusVersion) || consensusVersions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    this.restartAttempts = data.restartAttempts || this.restartAttempts;
    this.authPort = data.authPort || Ethereum.defaultAuthPort[this.network];
    this.consensusPeerPort = data.consensusPeerPort || Ethereum.defaultConsensusPeerPort[this.network];
    this.consensusRPCPort = data.consensusRPCPort || Ethereum.defaultConsensusRPCPort[this.network];
    this.consensusDockerImage = this.remote ? '' : data.consensusDockerImage ? data.consensusDockerImage : (consensusVersionObj.consensusImage || consensusVersionObj.image || '');
    this.validatorDockerImage = this.remote ? '' : data.validatorDockerImage ? data.validatorDockerImage : (consensusVersionObj.validatorImage || '');
    this.validatorRPCPort = data.validatorRPCPort || Ethereum.defaultValidatorRPCPort[this.network];
    this.passwordPath = data.passwordPath || this.passwordPath;
    this.mnemonicEncrypted = data.mnemonicEncrypted || <EncryptedKeystore>{};
    this.eth1Address = data.eth1Address || this.eth1Address;
    this.validators = data.validators || <Validators>{};
    this.jwt = data.jwt || Web3.utils.randomHex(32);

    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  toObject(): EthereumCryptoNodeData {
    return {
      ...this._toObject(),
      authPort: this.authPort,
      consensusClient: this.consensusClient,
      consensusVersion: this.consensusVersion,
      consensusRPCPort: this.consensusRPCPort,
      validatorRPCPort: this.validatorRPCPort,
      mnemonicEncrypted: this.mnemonicEncrypted,
      consensusPeerPort: this.consensusPeerPort,
      consensusDockerImage: this.consensusDockerImage,
      validatorDockerImage: this.validatorDockerImage,
      validators: this.validators,
      jwt: this.jwt,
    };
  }

  async start(password?: string, eth1AccountIndex = 0, slasher = 0): Promise<ChildProcess[]> {
    const { consensusDockerImage, validatorDockerImage, _fs: fs } = this;
    const secretsDir = await getSecretsDir(uuid());
    const passwordSecretPath = path.join(secretsDir, 'pass.pwd');
    const versions = Ethereum.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    const consensusVersions = Ethereum.versions(this.consensusClient, this.network);
    const consensusVersionData = consensusVersions.find(({ version }) => version === this.consensusVersion) || consensusVersions[0];
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
    if(!running || !consensusRunning  || !validatorRunning) {
      // execution versiondata, args, and dirs..
      const {
        dataDir: containerDataDir,
        walletDir: containerWalletDir,
        configDir: containerConfigDir,
      } = versionData;
      const {
        dataDir: consensusContainerDataDir,
        walletDir: consensusContainerWalletDir,
        configDir: consensusContainerConfigDir,
      } = consensusVersionData;

      const tmpdir = os.tmpdir();
      await fs.ensureDir(this.dataDir);
      await fs.ensureDir(this.walletDir);
      await fs.ensureDir(this.configDir);

      const configPath = path.join(this.configDir, Ethereum.configName(this));
      const configExists = await fs.pathExists(configPath);
      if(!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');

      const jwtPath = path.join(this.configDir, 'jwt.hex');
      const jwtExists = await fs.pathExists(jwtPath);
      if(!jwtExists) {
        await fs.writeFile(jwtPath, this.jwt, 'utf8');
      }
      if (this.role === Role.VALIDATOR && !password) {
        throw new Error('You must pass in a password the first time you run start() on a validator. This password will be used to generate the key pair.');
      } else if (this.role == Role.VALIDATOR && !validatorRunning && password ) {
        await fs.writeFile(passwordSecretPath, password);
        await this.encryptMnemonic(password);
      }
      if(!preMerge) {
        const consensus = true;
        const consensusConfigPath = path.join(this.configDir, Ethereum.configName(this, consensus));
        const consensusConfigExists = await fs.pathExists(consensusConfigPath);
        if(!consensusConfigExists) {
          const consensusConfig = Ethereum.generateConfig(this, this.network, this.consensusPeerPort, this.consensusRPCPort, consensus);
          await fs.writeFile(consensusConfigPath, consensusConfig, 'utf8');
        }
        switch (this.consensusClient) {
          case NodeClient.PRYSM: {

            {
              // Update chain-id and network-id in config to be numbers rather than strings
              // this is necessary in order to be compatible with Prysm 4.x.x
              const origConsensusConfig = await fs.readFile(consensusConfigPath, 'utf8');
              let consensusConfig = origConsensusConfig;
              const chainIdPatt = /chain-id:\s*"(.+?)"/;
              if(chainIdPatt.test(consensusConfig)) {
                consensusConfig = consensusConfig
                  .replace(chainIdPatt, 'chain-id: $1');
              }
              const networkIdPatt = /network-id:\s*"(.+?)"/;
              if(networkIdPatt.test(consensusConfig)) {
                consensusConfig = consensusConfig
                  .replace(networkIdPatt, 'network-id: $1');
              }
              if(consensusConfig !== origConsensusConfig) {
                await fs.writeFile(consensusConfigPath, consensusConfig, 'utf8');
              }
            }

            if (slasher) {
              await this.enableSlasher();
            } else {
              await this.disableSlasher();
            }
            break;
          }
          case NodeClient.TEKU: {
            break;
          }
        }
      }
      await this._docker.pull(this.dockerImage, str => this._logOutput(str));
      if(consensusDockerImage)
        await this._docker.pull(consensusDockerImage, str => this._logOutput(str));
      await this._docker.createNetwork(this.dockerNetwork);
      const executionService: ContainerService = {
        image: this.dockerImage,
        container_name: this.id,
        networks: [this.dockerNetwork],
        deploy: {
          resources: {
            limits: {
              cpus: this.dockerCPUs.toString(10),
              memory: this.dockerMem.toString(10) + 'MB',
            },
          },
        },
        ports: [
          `${this.rpcPort}:${this.rpcPort}/tcp`,
          `${this.peerPort}:${this.peerPort}/tcp`,
          `${this.peerPort}:${this.peerPort}/udp`,
        ],
        volumes: [
          `${this.configDir}:${containerConfigDir}`,
          `${this.dataDir}:${containerDataDir}`,
          `${this.walletDir}:${containerWalletDir}`,
        ],
        command: versionData.generateRuntimeArgs(this),
        //secrets: [],
        restart: `on-failure:${this.restartAttempts}`,
      } as ContainerService;
      const consensusService: ContainerService = {
        image: this.consensusDockerImage,
        container_name: this.consensusDockerName(),
        networks: [this.dockerNetwork],
        deploy: {
          resources: {
            limits: {
              cpus: this.dockerCPUs.toString(10),
              memory: this.dockerMem.toString(10) + 'MB',
            },
          },
        },
        ports: [
          `${this.consensusRPCPort}:${this.consensusRPCPort}/tcp`,
            `${this.consensusPeerPort}:${this.consensusPeerPort}/tcp`,
            `${this.consensusPeerPort}:${this.consensusPeerPort}/udp`,
          ],
        volumes: [
          `${this.configDir}:${consensusContainerConfigDir}`,
          `${this.dataDir}:${consensusContainerDataDir}`,
          `${this.walletDir}:${consensusContainerWalletDir}`,
        ],
        command: consensusVersionData.generateRuntimeArgs(this),
        secrets: [],
        restart: `on-failure:${this.restartAttempts}`,
      } as ContainerService;
      if (this.client == NodeClient.ERIGON)
        executionService.user = 'root';
      if ([NodeClient.NIMBUS, NodeClient.TEKU].includes(this.consensusClient))
        consensusService.user = 'root';
      const services: Services = {
        [this.id]: executionService,
        [this.consensusDockerName()]: consensusService,
        //validatorService?: validatorService
      } as Services;
      const composeConfig = {
        version: '3.1',
        services: services, //validatorService,
        networks: {
          [this.dockerNetwork]: {
            external: true,
          },
        },
        secrets: {
          password: {
            file: passwordSecretPath,
          },
        },
      };
      const composeConfigPath = path.join(this.configDir, 'docker-compose.yml');
      await fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});
      if (this.role === Role.VALIDATOR && password) {
        switch (this.consensusClient) {
          case NodeClient.PRYSM: {
            services[this.validatorDockerName()] = {
              image: this.validatorDockerImage,
              container_name: this.validatorDockerName(),
              networks: [this.dockerNetwork],
              deploy: {
                resources: {
                  limits: {
                    cpus: this.dockerCPUs.toString(10),
                    memory: this.dockerMem.toString(10) + 'MB',
                  },
                },
              },
              ports: [
                `${this.validatorRPCPort}:${this.validatorRPCPort}`,
                ],
              volumes: [
                `${this.configDir}:${consensusContainerConfigDir}`,
                `${this.dataDir}:${consensusContainerDataDir}`,
                `${this.walletDir}:${consensusContainerWalletDir}`,
              ],
              command: ` --config-file=/root/config/prysm-validator.yaml --${this.network.toLowerCase()}`,
              secrets: ['password'],
              restart: `on-failure:${this.restartAttempts}`,
            } as ContainerService;
            await fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});
            await this.prysmImportValidators(password);
            break;
          }
          case NodeClient.TEKU: {
            const tekuValidators = await this.tekuImportValidators(password);
            services[this.consensusDockerName()]['secrets'] = ['password'];
            //const tekuConfig =
            //this._fs.
            break;
          }
          case NodeClient.LIGHTHOUSE: {
            services[this.validatorDockerName()] = {
              image: this.validatorDockerImage,
              container_name: this.validatorDockerName(),
              networks: [this.dockerNetwork],
              deploy: {
                resources: {
                  limits: {
                    cpus: this.dockerCPUs.toString(10),
                    memory: this.dockerMem.toString(10) + 'MB',
                  },
                },
              },
              ports: [
                `${this.validatorRPCPort}:${this.validatorRPCPort}`,
                ],
              volumes: [
                `${this.configDir}:${consensusContainerConfigDir}`,
                `${this.dataDir}:${consensusContainerDataDir}`,
                `${this.walletDir}:${consensusContainerWalletDir}`,
              ],
              command: ` lighthouse validator --beacon-nodes="http://${this.consensusDockerName()}:${this.consensusRPCPort}" --validators-dir=/root/keystore/validators --enable-doppelganger-protection --suggested-fee-recipient=${hexPrefix(this.eth1Address)} --network=${this.network.toLowerCase()}`,
              secrets: ['password'],
              restart: `on-failure:${this.restartAttempts}`,
            } as ContainerService;
            await fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});
            await this.lighthouseImportValidators(password);
            break;
          }

        }
        await fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});
      } //end validator
      const args = [
        'up',
        '-d',
        //'--remove-orphans',
      ];
      const exitCode = await new Promise<number>((resolve, reject) => {
        this._docker.composeDo(
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
      await fs.remove(secretsDir);
      if(exitCode !== 0)
        throw new Error(`Docker-compose for ${this.id} et al with ${this.dockerImage} failed with exit code ${exitCode}`);

      if (this.role === Role.VALIDATOR && password) {
        switch (this.consensusClient) {
          case NodeClient.NIMBUS: {
            // nimbus can't import from cli non-interactively yet, so have to do it manually by having mounted passwords matching the name of keystore
            // so has to import after already running, or passwords will get wiped out and container will fail
            await this.nimbusImportValidators(password);
            break;
          }
        }
      }
    } // end !running
    this._instances = await this.dockerAttach();
    this._instance = this._instances[0];
    return this.instances();
  } // end start()

  async stop(): Promise<void> {
    try {
      await this._docker.composeDown(path.join(this.configDir, 'docker-compose.yml'));
    } catch(err) {
      this._logError(err);
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
      } catch (err) {
        this._logError(err);
      }
    }
  }

  async stakeValidator(password: string, numVals = 1, validatorStartIndex = 0, eth1AccountIndex = 0, maxPriorityFeePerGas = 2, maxFeePerGas = this.network == NetworkType.MAINNET ? 50 : 100): Promise<string[]> {
    const validatorIndexes = Array.from(Array(numVals).keys()).map(x => x + validatorStartIndex);
    const mnemonic = decrypt(this.mnemonicEncrypted, password);
    for (const validatorIndex in validatorIndexes) {
      const validatorKeystore = await generateEth2ValidatorKeystore(mnemonic, password, parseInt(validatorIndex));
      const validator = <ValidatorObject>{
        keystore: validatorKeystore,
        pubkey: JSON.parse(validatorKeystore).pubkey,
      };
      this.validators[parseInt(validatorIndex) ] = validator;
    }
    const stakingDockerImage = 'icculp/staking-deposit-cli:v2.3.0-DEBUG';
    const stakingRunning = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.stakingDockerName());
    if (stakingRunning) {
      return ['Staking already in process'];
    }
    await this._docker.pull(stakingDockerImage, str => this._logOutput(str));
    const stakingDir = path.join(this.walletDir, 'validator_keys');
    const containerStakingDir = '/root/keystore/validator_keys';
    await this._fs.ensureDir(stakingDir);
    const stakingRun = ' --language=english --non_interactive existing-mnemonic ' +
      `--mnemonic="${mnemonic}" --validator_start_index=${validatorStartIndex} ` +
      `--num_validators=${numVals} --folder=/root/keystore ` +
      `--chain ${this.network.toLowerCase()} --keystore_password ${password}`;
    const stakingService: ContainerService = {
      image: stakingDockerImage,
      container_name: this.stakingDockerName(),
      networks: [this.dockerNetwork],
      deploy: {
        resources: {
          limits: {
            cpus: this.dockerCPUs.toString(10),
            memory: this.dockerMem.toString(10) + 'MB',
          },
        },
      },
      ports: [],
      volumes: [
        `${stakingDir}:${containerStakingDir}`,
      ],
      command: stakingRun,
      restart: `on-failure:${this.restartAttempts}`,
    } as ContainerService;
    const composeConfig = {
      version: '3.3',
      services: { [this.stakingDockerName()]: stakingService },
      networks: {
        [this.dockerNetwork]: {
          external: true,
        },
      },
      // secrets: {
      //   password: {
      //     file: passwordSecretPath,
      //   },
      // },
    };
    const composeConfigPath = path.join(this.configDir, 'staking.yml');
    await this._fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});
    const args = [
      'run',
      '--rm',
      this.stakingDockerName(),
    ];
    const stakingExitCode = await new Promise<number>((resolve, reject) => {
      this._docker.composeDo(
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
    //const stakingInstance = this._docker.attach(
    //  this.stakingDockerName(),
    //  output => this._logOutput('staking - ' + output),
    //  err => {
    //    this._logError(err);
    //  },
    //  code => {
    //    this._logClose(code);
    //  },
    //);
    await this._fs.remove(composeConfigPath);
    if(stakingExitCode !== 0) {
      throw new Error(`Docker run for ${stakingDockerImage} failed with exit code ${stakingExitCode}`);
    }
    while (await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.stakingDockerName())) {
      await timeout(5000);
    }
    const files = await this._fs.readdir(stakingDir);
    const timestamps: Array<number> = [];
    for (const file of files) {
      if (file.includes('deposit_data-')) {
        timestamps.push(parseInt(file.split('-', 2)[1].split('.', 1)[0]));
      } else {
        await this._fs.remove(file);
      }
    }
    const latestTimestamp = timestamps.reduce((a: number, b: number) => Math.max(a, b), 0);
    const depositJSON = JSON.parse(await this._fs.readFile(path.join(stakingDir, 'deposit_data-' + String(latestTimestamp) + '.json')));
    const depositTXs: string[] = [];
    if (depositJSON && Array.isArray(depositJSON) ) {
      for (const deposit of depositJSON) {
        try {
          depositTXs.push(await this.validatorDeposit(deposit, password, eth1AccountIndex, maxPriorityFeePerGas, maxFeePerGas));
        } catch(err) {
          console.log('Transaction failed due to error:', err);
          depositTXs.push(`Pubkey {${deposit.pubkey}} ${err.message}`);
        }
      }
    } else {
      try {
        depositTXs.push(await this.validatorDeposit(depositJSON, password, eth1AccountIndex, maxPriorityFeePerGas, maxFeePerGas));
      } catch(err) {
        console.log('Transaction failed due to error:', err);
        depositTXs.push(err);
      }
    }
    switch (this.consensusClient) {
      case NodeClient.PRYSM:
        await this.prysmImportValidators(password);
        break;
      case NodeClient.TEKU:
        await this.tekuImportValidators(password);
        break;
      case NodeClient.NIMBUS:
        await this.nimbusImportValidators(password);
        break;
      case NodeClient.LIGHTHOUSE:
        await this.lighthouseImportValidators(password);
        break;
    }
    if (!(this.consensusClient == NodeClient.NIMBUS)) {
      const secretsDir = await getSecretsDir(uuid());
      const passwordSecretPath = path.join(secretsDir, 'pass.pwd');
      await this._fs.writeFile(passwordSecretPath, password);
      const composeFilePath = path.join(this.configDir, 'docker-compose.yml');
      const composeFile = JSON.parse(await this._fs.readFile(composeFilePath));
      composeFile.secrets.password.file = passwordSecretPath;
      await this._fs.writeJson(composeFilePath, composeFile, {spaces: 2});
      await new Promise<number>((resolve, reject) => {
        this._docker.composeDo(
          composeFilePath,
          [
            'up', '-d', //'--remove-orphans'
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
      await this._fs.remove(secretsDir);
    }
    await this.dockerAttach();
    return depositTXs;
  } // end stakeValidator()

  async dockerAttach(): Promise<ChildProcess[]> {
    const instances = [];
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
    instances.push(instance);
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
    instances.push(consensusInstance);
    if(this.role == Role.VALIDATOR && [NodeClient.PRYSM].includes(this.consensusClient)) {
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
      instances.push(validatorInstance);
    }
    return instances;
  }

  async validatorDeposit(depositJSON: DepositKeyInterface, password: string, eth1AccountIndex = 0, maxPriorityFeePerGas = 2, maxFeePerGas = 50, topUp?: false): Promise<string> {
    const beaconSynced = await this.beaconSynced();
    const executionSynced = await this.executionSynced();
    if (!beaconSynced || !executionSynced) {
      // executionSynced might show true when the node hasn't started syncing yet, but in that case beaconSynced should always be false
      const message = `In order to prevent duplicate deposits and loss of funds, we require your node to be fully synced before staking your validators. Execution synced: {${executionSynced.toString()}} Beacon synced: {${beaconSynced.toString()}} Pubkey: {${depositJSON.pubkey}}`;
      console.log(message);
      return message;
    }
    const ValidatorStatuses = ['pending_initialized', 'pending_queued', 'active_ongoing', 'active_exiting', 'active_slashed', 'exited_unslashed', 'exited_slashed', 'withdrawal_possible'];
    const status = await this.validatorStatus(depositJSON.pubkey);
    if (ValidatorStatuses.includes(status)) {
      const message = 'A deposit already exists on the beacon chain for pubkey {' + depositJSON.pubkey + '} with current state {' + status + '}';
      console.log(message);
      if (topUp) {
        // check deposit balance, if below 32 set amouunt to difference for transactionparameters
      } else {
        return message;
      }
    } else if (status == 'invalid') {
      return 'Uh oh, there is a problem with the deposit.json data. Please reach out.';
    } else if (status == 'not found') {
        // okay to proceed
      const eth1DepositCheck = await this.checkDepositContract(depositJSON.pubkey);
      if (!(eth1DepositCheck == 'Not found')) {
        return 'A DepositEvent already exists in the anchor chain deposit contract, but hasn\'t yet reached the beacon chain for {' + depositJSON.pubkey
          + '}. transactionHash for deposit: {' + eth1DepositCheck +'}';
      }
      const jsonUrl = `http://localhost:${this.rpcPort}`;
      const eth1DerivationPath = `m/44'/60'/0'/0/${eth1AccountIndex.toString()}`; //m/44/60/0/0/i is eth1 wallet (aka account aka withdrawal) for account number i
      const eth1Wallet = Wallet.fromMnemonic(decrypt(this.mnemonicEncrypted, password), eth1DerivationPath);
      const web3 = new Web3(new Web3.providers.HttpProvider(jsonUrl));
      const eth1Account = web3.eth.accounts.privateKeyToAccount(eth1Wallet.privateKey); //
      web3.eth.accounts.wallet.add(eth1Account);
      const mainnetStakingAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
      const goerliStakingAddress = '0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b';
      const depositContract = new web3.eth.Contract(contractAbi, this.network == NetworkType.MAINNET ? mainnetStakingAddress : goerliStakingAddress); //, signer);
      const transactionParameters = {
        // gasPrice: Web3.utils.toHex(await web3.eth.getGasPrice()), null in eip1559. maxFeePerGas set and maxPriorityFeePerGas to gasPrice when it's set
        maxFeePerGas: web3.utils.toHex(web3.utils.toWei(maxFeePerGas.toString(10), 'gwei')),  // 2 * base fee + maxPriorityFeePerGas
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei(maxPriorityFeePerGas.toString(10), 'gwei')), // tip paid to miner, default 1
        chain: this.network.toLowerCase(), // to prevent replay attacks on other networks
        hardfork: 'london', // must be supplied along with chain if either set
        from: eth1Account.address,
        value: Web3.utils.toWei('32', 'ether'),
        gasLimit: 15000000,
        //gas: 750000,
        data: {},
      };
      const gasEstimate = await depositContract.methods.deposit(
          hexPrefix(depositJSON.pubkey),
          hexPrefix(depositJSON.withdrawal_credentials),
          hexPrefix(depositJSON.signature),
          hexPrefix(depositJSON.deposit_data_root)
        ).estimateGas(transactionParameters).catch(function(error: any) {
          console.log('Estimategas() - catch error');
          console.log(error);
          return `Pubkey {${depositJSON.pubkey}} ${error.message}`;
        }); //.on('error', console.warn);
      if ((typeof gasEstimate) === 'string') {
        return gasEstimate;
      } else if ((typeof gasEstimate) === 'number' ) {
        transactionParameters.gasLimit = Math.round(gasEstimate * 2);
      } else {
        return `Unexpected error, gasEstimate: {${gasEstimate}} pubkey {${depositJSON.pubkey}}`;
      }
      console.log(1611, transactionParameters.gasLimit, transactionParameters);
      // if error in estimate*, send won't take value but catch here only catches error responses, so input error throws error to catch in stake function
      const depositTX = await depositContract.methods.deposit(
        hexPrefix(depositJSON.pubkey),
        hexPrefix(depositJSON.withdrawal_credentials),
        hexPrefix(depositJSON.signature),
        hexPrefix(depositJSON.deposit_data_root)
      ).send(transactionParameters).catch(function(error: any) {
          console.log('Send() - catch error');
          console.log(error);
          return `Pubkey {${depositJSON.pubkey}} ${error.message}`;
        });

    while (true) {
      console.log(1625, `Awaiting confirmation of deposit for pubkey ${depositJSON.pubkey} and transactionHash ${depositTX.transactionHash}`);
      if (depositTX && depositTX.transactionHash) {
        const receipt = await web3.eth.getTransactionReceipt(depositTX.transactionHash);
        if (receipt && receipt.blockNumber) {
          console.log(`Deposit for pubkey ${depositJSON.pubkey} has been confirmed at block number ${receipt.blockNumber}`);
          console.log('Note that it might take 30 - 90 sceonds for the block to propagate before it\'s visible in etherscan.io');
          break;
        } else {
          console.log(1633, receipt,);
        }
      } else { // no tx hash to wait for receipt
        //return 'Deposit failed for pubkey ' + depositJSON.pubkey + ' and transactionHash ' + depositTX.transactionHash)
        // getTransactionReceipt waits for receipt or failure, so here it failed
        console.log(1636);
        //console.log(`Waiting for tx ${depositTX.transactionHash} to be mined, currently in block ` + await web3.eth.getBlockNumber());
        //await timeout(4000);
      }
    }
    //console.log(Object.getOwnPropertyNames(depositTX), depositTX);
    return  `Deposit for pubkey {${hexPrefix(depositJSON.pubkey)}} confirmed with transactionHash: ${depositTX.transactionHash}`;
  } else {
    return `We received an unexpected status: {${status}}`;
  }
    // if tracking validatorStartIndex, increment here
    return 'success??';
  } // end validatorDeposit()

  async beaconSynced(): Promise<boolean> {
    try {
      const apiEndpointPath = '/eth/v1/node/syncing';
      const { body = {} } = await request.get(`0.0.0.0:${this.consensusRPCPort}${apiEndpointPath}`);
      if (body.data && body.data.is_syncing) {
        console.log('Beacon chain still syncing');
        return false;
      } else if (body.data && !(body.data.is_syncing)) {
        return true;
      } else
        return false;
    } catch(err) {
      console.log(err);
      return false;
    }
  }

  async executionSynced(): Promise<boolean> {
    try {
      const { body = {} } = await request
        .post(`0.0.0.0:${this.rpcPort}`)
        .set('Accept', 'application/json')
        .auth(this.rpcUsername, this.rpcPassword)
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '2.0',
          method: 'eth_syncing',
          params: [],
        });
      if (!body.result) {
        return true;
      } else {
        console.log('Sync your exeuction node');
        return false;
      }
    } catch(err) {
      console.log(err);
      return false;
    }
  }

  async checkDepositContract(pubkey: string): Promise<string> {
    const jsonUrl = `http://localhost:${this.rpcPort}`;
    const web3 = new Web3(new Web3.providers.HttpProvider(jsonUrl));
    const latest_block = await web3.eth.getBlockNumber();
    const historical_block = latest_block - 10000; // about a day and a half
    const mainnetStakingAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
    const goerliStakingAddress = '0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b';
    const depositContract = new web3.eth.Contract(contractAbi, this.network == NetworkType.MAINNET ? mainnetStakingAddress : goerliStakingAddress);
    const events = await depositContract.getPastEvents(
        'DepositEvent',
        { fromBlock: historical_block, toBlock: 'latest' }
    );
    const deposit = events.filter(deposit => hexPrefix(deposit.returnValues.pubkey) == hexPrefix(pubkey));
    if (deposit.length > 0) {
      return deposit[0].transactionHash;
    } else {
      return 'Not found';
    }
  }

  async validatorStatus(validatorPubKey: string): Promise<string> {
    try {
      const apiEndpointPath = '/eth/v1/beacon/states/head/validators/';
      const { body = {} } = await request.get(`0.0.0.0:${this.consensusRPCPort}${apiEndpointPath}${hexPrefix(validatorPubKey)}`);
      console.log(body);
      if (body.data && body.data.status) {
        console.log(body.data.status);
        return body.data.status;
      } else if (body.code && body.message) {
        console.log(body.code, body.message);
        return body.message;
      }
    } catch(err) {
      if (err.status == 404) {
        return 'not found';
      }
      else if (err.status == 400) {
        return 'invalid';
      } else {
        console.log(err);
      }
      return `Failed to query validator status, ensure that the beacon node is reachable at port ${this.consensusRPCPort}`;
    }
    return 'We shouldn\'t reach here';
  }

  async prysmRunValidator(password: string): Promise<ChildProcess> {
    await this.generatePrysmValidatorConfig();
    const args = await this.generateConsensusArgs(password);
    const validatorArgs = [
      ...args,
      '--name', this.validatorDockerName(),
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

  async tekuImportValidators(password: string): Promise<boolean> {
    const versions = Ethereum.versions(this.consensusClient, this.network); //NodeClient.PRYSM
    const versionData = versions.find(({ version }) => version === this.version) || versions[0]; //this.consensusVersion?
    const {
      walletDir: containerWalletDir,
      passwordPath: containerPasswordPath,
    } = versionData;
    const stakingDir = path.join(this.walletDir, 'validators');
    await this._fs.ensureDir(stakingDir);
    let tekuValidators = 'validator-keys: "';
    const filename = 'keystore-m_12381_3600_0_0_accountIndex.json';
    if (Object.keys(this.validators).length > 0) {
      for (const validatorIndex of Object.keys(this.validators)) {
        const validator = this.validators[parseInt(validatorIndex) ];
        const validatorKeystore = validator.keystore;
        validator.status = await this.validatorStatus(validator.pubkey);
        const keyname = filename.replace('accountIndex', validatorIndex.toString());
        await this._fs.writeFile(path.join(stakingDir, keyname), validatorKeystore, 'utf8');
        tekuValidators += path.join(containerWalletDir, 'validators', keyname) + ':/run/secrets/password,';
      }
    } else {
      return false;
    }
    tekuValidators += '"';
    const consensusConfigPath = path.join(this.configDir, 'teku.yaml');
    const consensusConfigExists = await this._fs.pathExists(consensusConfigPath);
    if(!consensusConfigExists) {
      return false;
    }
    const consensusConfig = await this._fs.readFile(consensusConfigPath);
    const newLineValidator = `\n${tekuValidators}`;
    if (consensusConfig.match(/\nvalidator-keys:/)) {
      const a = consensusConfig.replace(/\nvalidator-keys:.+/i, '\n' + tekuValidators);
      await this._fs.writeFile(consensusConfigPath, a);
    } else if (consensusConfig.match(/\n#validator-keys:.+/i)) {
      const b = consensusConfig.replace(/#validator-keys:.+/i, '\n' + tekuValidators);
      await this._fs.writeFile(consensusConfigPath, b);
    } else {
      await this._fs.writeFile(consensusConfigPath, consensusConfig + newLineValidator);
    }
    return true;
  }

  async prysmImportValidators(password: string): Promise<boolean> {
    await this.generatePrysmValidatorConfig();
    console.log(1804, 'prysmImportValidators');
    //const args = await this.generateConsensusArgs(password)
    const stakingDir = path.join(this.walletDir, 'validators');
    await this._fs.ensureDir(stakingDir);
    const filename = 'keystore-m_12381_3600_0_0_accountIndex.json';
    if (Object.keys(this.validators).length > 0) {
      for (const validatorIndex of Object.keys(this.validators)) {
        const validator = this.validators[parseInt(validatorIndex) ];
        const validatorKeystore = validator.keystore;
        validator.status = await this.validatorStatus(validator.pubkey);
        await this._fs.writeFile(path.join(stakingDir, filename.replace('accountIndex', validatorIndex.toString())), validatorKeystore, 'utf8');
      }
    }
    const composeFilePath = path.join(this.configDir, 'docker-compose.yml');
    const composeFile = JSON.parse(await this._fs.readFile(composeFilePath));
    const secretsDir = await getSecretsDir(uuid());
    const passwordSecretPath = path.join(secretsDir, 'pass.pwd');
    composeFile.secrets.password.file = passwordSecretPath;
    const importName = this.validatorDockerName() + '-import';
    composeFile.services[importName] = { ...composeFile.services[this.validatorDockerName()] };
    composeFile.services[importName].container_name = importName;
    composeFile.services[importName].ports = [];
    composeFile.services[importName].command = ` --config-file=/root/config/prysm-validator.yaml accounts import --${this.network.toLowerCase()}`;
    await this._fs.ensureDir(secretsDir);
    await this._fs.writeFile(passwordSecretPath, password);
    await this._fs.writeJson(composeFilePath, composeFile, {spaces: 2});
    await new Promise<number>((resolve, reject) => {
      this._docker.composeDo(composeFilePath,
      ['run', '--rm', importName],
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
    this._docker.attach(importName);
    while (await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(importName)) {
      console.log(1916);
      await timeout(5000);
    }
    delete composeFile.services[importName];
    // console.log(1884, composeFile.services)
    // await timeout(10000)
    await this._fs.writeJson(composeFilePath, composeFile, {spaces: 2});
    await this._fs.remove(secretsDir);
    await this._fs.ensureDir(secretsDir);
    await this._fs.writeFile(passwordSecretPath, password);
    await this._fs.writeJson(composeFilePath, composeFile, {spaces: 2});
    await new Promise<number>((resolve, reject) => {
      this._docker.composeDo(composeFilePath,
      ['up', '-d', this.validatorDockerName()],
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
    this._docker.attach(this.validatorDockerName());
    return true;
  }

  async nimbusImportValidators(password: string): Promise<boolean> {
    const composeFilePath = path.join(this.configDir, 'docker-compose.yml');
    const composeFile = JSON.parse(await this._fs.readFile(composeFilePath));
    const secretsDir = await getSecretsDir(uuid());
    const passwordSecretPath = path.join(secretsDir, 'pass.pwd');
    await this._fs.writeFile(passwordSecretPath, password);
    await this._fs.chmod(passwordSecretPath, '0600');
    const keyPathname = 'keystore.json';
    if (Object.keys(this.validators).length > 0) {
      composeFile.services[this.consensusDockerName()].secrets = [];
      composeFile.secrets = {};
      for (const validatorIndex of Object.keys(this.validators)) {
        const validator = this.validators[parseInt(validatorIndex) ];
        const validatorKeystore = validator.keystore;
        validator.status = await this.validatorStatus(validator.pubkey);
        const passwordFilename = hexPrefix(validator.pubkey);
        composeFile.services[this.consensusDockerName()].secrets.push(passwordFilename);
        composeFile.secrets[passwordFilename] = { file: passwordSecretPath };
        const pubDir = path.join(this.walletDir, 'validators', hexPrefix(validator.pubkey));
        await this._fs.ensureDir(pubDir);
        await this._fs.writeFile(path.join(pubDir, keyPathname), validatorKeystore, 'utf8');
      }
    }
    await this._fs.writeFile(composeFilePath, JSON.stringify(composeFile));
    await new Promise<number>((resolve, reject) => {
      this._docker.composeDo(composeFilePath, ['up', '-d' ], //'--remove-orphans'],
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
    await this.dockerAttach();
    await this._fs.remove(secretsDir);
    return true;
  }

  async lighthouseImportValidators(password: string): Promise<boolean> {
    const composeFilePath = path.join(this.configDir, 'docker-compose.yml');
    const composeFile = JSON.parse(await this._fs.readFile(composeFilePath));
    if (Object.keys(this.validators).length > 0) {
      for (const validatorIndex of Object.keys(this.validators)) {
        const validator = this.validators[parseInt(validatorIndex) ];
        const validatorKeystore = validator.keystore;
        validator.status = await this.validatorStatus(validator.pubkey);
      }
    } else {
      return false;
    }
    await this._docker.composeDown(composeFilePath, this.validatorDockerName());
    const secretsDir = await getSecretsDir(uuid());
    const passwordSecretPath = path.join(secretsDir, 'pass.pwd');
    composeFile.secrets.password.file = passwordSecretPath;
    const command = composeFile.services[this.validatorDockerName()].command;
    composeFile.services[this.validatorDockerName()].command = ` lighthouse --network ${this.network.toLowerCase()} account validator --validators-dir=/root/keystore/validators import --reuse-password --stdin-inputs --password-file=/run/secrets/password  --directory=/root/keystore/validator_keys `;
    await this._fs.ensureDir(secretsDir);
    await this._fs.writeFile(passwordSecretPath, password);
    await this._fs.writeJson(composeFilePath, composeFile, {spaces: 2});
    // import validators
    await new Promise<number>((resolve, reject) => {
      this._docker.composeDo(composeFilePath,
      ['up', '-d', this.validatorDockerName()],
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
    this._docker.attach(this.validatorDockerName());
    while (await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.validatorDockerName())) {
      //console.log(1916)
      await timeout(5000);
    }
    composeFile.services[this.validatorDockerName()].command = command;
    await this._fs.writeJson(composeFilePath, composeFile, {spaces: 2});
    if (await this._fs.pathExists(path.join(this.walletDir, 'validators', 'validator_keys'))) {
      const validatorDefinitions = await this._fs.readFile(path.join(this.walletDir, 'validators', 'validator_definitions.yml'), 'utf8');
      await this._fs.writeFile(path.join(this.walletDir, 'validators'), validatorDefinitions.replace(password, '/run/secrets/password'));
    }
    await this._fs.remove(passwordSecretPath);
    await this._fs.writeFile(passwordSecretPath, password);

    //console.log(1928)
    this._docker.composeDo(composeFilePath, ['up', '-d', this.validatorDockerName() ]); //'--remove-orphans'])
    this._docker.attach(this.validatorDockerName());
    await this._fs.remove(secretsDir);
    return true;
  }

  async generateConsensusArgs(password?: string): Promise<string[]> { // create service interface
    const versions = Ethereum.versions(this.consensusClient, this.network); //NodeClient.PRYSM
    const versionData = versions.find(({ version }) => version === this.version) || versions[0]; //this.consensusVersion?
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configDir: containerConfigDir,
      passwordPath: containerPasswordPath,
    } = versionData;
    const args = [
      '-d',
      '--rm',
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--network', this.dockerNetwork,
      '-v', `${this.walletDir}:${containerWalletDir}`,
      '-v', `${this.configDir}:${containerConfigDir}`,
      '-v', `${this.dataDir}:${containerDataDir}`,
    ];
    if (password) {
      const tmpdir = os.tmpdir();
      const passwordPath = this.passwordPath || path.join(tmpdir, uuid());
      const passwordFileExists = await this._fs.pathExists(passwordPath);
      if(!passwordFileExists)
        await this._fs.writeFile(passwordPath, password, 'utf8');
      return [...args, '-v', `${passwordPath}:${containerPasswordPath}`];
    }
    return args;
  }

  async generatePrysmValidatorConfig(): Promise<void> {
    const configDir = this.configDir || path.join(os.tmpdir(), uuid());
    await this._fs.ensureDir(configDir);
    const prysmValidatorPort = '4000';
    const validatorConfigPath = path.join(configDir, 'prysm-validator.yaml');
    const validatorConfigExists = await this._fs.pathExists(validatorConfigPath);
    if(!validatorConfigExists) {
      const validatorConfig = prysmConfig.validator
        .replace('{{ETH1_ADDRESS}}', this.eth1Address)
        .replace(/{{CONSENSUS}}/g, `${this.consensusDockerName()}:${prysmValidatorPort}`)
        .replace('{{RPC_PORT}}', this.validatorRPCPort.toString(10));
      await this._fs.writeFile(validatorConfigPath, validatorConfig, 'utf8');
    }
  }

  // exitValidator()

 async encryptMnemonic(password: string, mnemonic?: string, eth1AccountIndex = 0): Promise<EncryptedKeystore> {
    const mnemonicExists = this.mnemonicEncrypted && JSON.stringify(this.mnemonicEncrypted) != '{}' &&  this.mnemonicEncrypted.message != ''; //await this._fs.pathExists(mnemonicPath);
    if (mnemonic) {
      this.mnemonicEncrypted = encrypt(mnemonic, password, this.id);
    } else if (!mnemonic && !mnemonicExists) {
      mnemonic = bip39.generateMnemonic(256);
      this.mnemonicEncrypted = encrypt(mnemonic, password, this.id);
    } else {
      mnemonic = decrypt(this.mnemonicEncrypted, password);
    }
    const eth1DerivationPath = `m/44'/60'/0'/0/${eth1AccountIndex.toString()}`;
    if (!this.eth1Address || this.eth1Address == '') {
      this.eth1Address = Wallet.fromMnemonic(mnemonic, eth1DerivationPath).address;
      console.log('Eth1 Wallet address to fund with 32ETH + gas to per Validator: ' + this.eth1Address);
      console.log('You should also be able to find this as the suggested-fee-recipient parameter in the validator config');
    }
    await timeout(5000);
    console.log('Mnemonic encrypted'); //, mnemonic);
    return this.mnemonicEncrypted;
  }

  async enableSlasher(): Promise<boolean> {
    const consensusConfigPath = path.join(this.configDir, 'prysm-beacon.yaml');
    const consensusConfigExists = await this._fs.pathExists(consensusConfigPath);
    if(!consensusConfigExists)
      return false;
    const consensusConfig = await this._fs.readFile(consensusConfigPath);
    await this._fs.writeFile(consensusConfigPath, consensusConfig.replace('historical-slasher-node: false', 'historical-slasher-node: true')
                                                                 .replace('slasher: false', 'slasher: true'), 'utf8');
    console.log('Slashing altruist enabled');
    return true;
  }

  async disableSlasher(): Promise<boolean> {
    const consensusConfigPath = path.join(this.configDir, 'prysm-beacon.yaml');
    const consensusConfigExists = await this._fs.pathExists(consensusConfigPath);
    if(!consensusConfigExists)
      return false;
    const consensusConfig = await this._fs.readFile(consensusConfigPath);
    await this._fs.writeFile(consensusConfigPath, consensusConfig.replace('historical-slasher-node: true', 'historical-slasher-node: false')
                                                                 .replace('slasher: true', 'slasher: false'), 'utf8');
    console.log('Slashing altruist disabled');
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
