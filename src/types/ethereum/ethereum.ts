import {
  CryptoNodeData,
  VersionDockerImage,
}                       from '../../interfaces/crypto-node';
import {
  defaultDockerNetwork,
  NetworkType,
  NodeClient,
  NodeType,
  Role,
  Status,
}                       from '../../constants';
import { Docker }       from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid }   from 'uuid';
import request          from 'superagent';
import fs               from 'fs-extra';
import path             from 'path';
import os               from 'os';
import { Bitcoin }      from '../bitcoin/bitcoin';
import {
  aggregateStats,
  filterVersionsByNetworkType,
}                       from '../../util';

const coreConfig = `
[Eth]
NetworkId = 1

[Node]
DataDir = "/root/.ethereum"
KeyStoreDir = "/root/keystore"
HTTPHost = "0.0.0.0"
HTTPPort = {{RPC_PORT}}
HTTPVirtualHosts = ["*"]
HTTPModules = ["net", "web3", "eth"]

[Node.P2P]
ListenAddr = ":{{PEER_PORT}}"
`;

export interface EthCryptoNodeData extends CryptoNodeData {
  dockerRpcDaemonCPUs?: number;
  dockerRpcDaemonMem?: number;
}

export interface EthVersionDockerImage extends VersionDockerImage {
  generateRpcRuntimeArgs?: (data: EthCryptoNodeData) => string;
}

export class Ethereum extends Bitcoin {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Ethereum.clients[0];
    let versions: EthVersionDockerImage[];
    switch (client) {
      case NodeClient.GETH:
        versions = [
          {
            version: '1.10.15',
            clientVersion: '1.10.15',
            image: 'ethereum/client-go:v1.10.15',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [NetworkType.MAINNET, NetworkType.RINKEBY],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.14',
            clientVersion: '1.10.14',
            image: 'ethereum/client-go:v1.10.14',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [ NetworkType.MAINNET, NetworkType.RINKEBY ],
            breaking: true,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
            async upgrade(data: CryptoNodeData): Promise<boolean> {
              const { configPath } = data;
              if (configPath && (await fs.pathExists(configPath))) {
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
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [ NetworkType.MAINNET, NetworkType.RINKEBY ],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.12',
            clientVersion: '1.10.12',
            image: 'ethereum/client-go:v1.10.12',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [ NetworkType.MAINNET, NetworkType.RINKEBY ],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.11',
            clientVersion: '1.10.11',
            image: 'ethereum/client-go:v1.10.11',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [ NetworkType.MAINNET, NetworkType.RINKEBY ],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.10',
            clientVersion: '1.10.10',
            image: 'ethereum/client-go:v1.10.10',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [ NetworkType.MAINNET, NetworkType.RINKEBY ],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
          {
            version: '1.10.3',
            clientVersion: '1.10.3',
            image: 'ethereum/client-go:v1.10.3',
            dataDir: '/root/.ethereum',
            walletDir: '/root/keystore',
            configPath: '/root/config.toml',
            networks: [ NetworkType.MAINNET, NetworkType.RINKEBY ],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --config=${this.configPath}` + (network === NetworkType.MAINNET ? '' : ` -${network.toLowerCase()}`);
            },
          },
        ];
        break;
      case NodeClient.ERIGON:
        versions = [
          {
            version: '2022.01.2',
            clientVersion: '2022.01.2',
            image: 'thorax/erigon:v2022.01.02',
            dataDir: '/home/erigon/data',
            walletDir: '', // not required
            configPath: '', // not required
            networks: [
              // added only supported chains by Pocket Network as Chains
              NetworkType.MAINNET,
              NetworkType.RINKEBY,
              NetworkType.GOERLI,
              NetworkType.ROPSTEN,
              NetworkType.KOVAN,
              NetworkType.BSC,
            ],
            breaking: false,
            generateRuntimeArgs(data: EthCryptoNodeData): string {
              const { network = '', peerPort } = data;

              return ' erigon ' + [
                '--datadir=/home/erigon/data',
                `--port ${peerPort}`, // default to 30303
                `--chain ${network.toLowerCase()}`,
                '--private.api.addr=0.0.0.0:9090',
                '--private.api.addr=0.0.0.0:9090',
              ].join(' ');
            },
            generateRpcRuntimeArgs(data: EthCryptoNodeData): string {
              const { id } = data;
              return ' rpcdaemon ' + [
                `--private.api.addr=${id}:9090`,
                `--txpool.api.addr=${id}:9090`,
                '--http.addr=0.0.0.0',
                '--http.vhosts=*',
                '--http.corsdomain=*',
                '--http.api=eth,erigon,web3,net,debug,trace,txpool',
              ].join(' ');
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
    NodeClient.GETH,
    NodeClient.ERIGON,
  ];

  static nodeTypes = [
    NodeType.FULL,
    NodeType.ARCHIVAL,
  ];

  static networkTypes = [
    NetworkType.MAINNET,
    NetworkType.RINKEBY,
    NetworkType.GOERLI,
    NetworkType.ROPSTEN,
    NetworkType.KOVAN,
  ];

  static networkTypesByClient = {
    [NodeClient.GETH]: [
      NetworkType.MAINNET,
      NetworkType.RINKEBY,
    ],
    [NodeClient.ERIGON]: [
      NetworkType.MAINNET,
      NetworkType.RINKEBY,
      NetworkType.GOERLI,
      NetworkType.ROPSTEN,
      NetworkType.KOVAN,
    ],
  };

  static roles = [
    Role.NODE,
  ];

  static defaultRPCPort = {
    [NetworkType.MAINNET]: 8545,
    [NetworkType.RINKEBY]: 18545,
    [NetworkType.GOERLI]: 8545,
    [NetworkType.ROPSTEN]: 8545,
    [NetworkType.KOVAN]: 8545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 8546,
    [NetworkType.RINKEBY]: 18546,
    [NetworkType.GOERLI]: 30303,
    [NetworkType.ROPSTEN]: 30303,
    [NetworkType.KOVAN]: 30303,
  };

  static defaultCPUs = 8;
  static defaultArchivalCPUs = 16;
  static rpcDaemonCPUs = 2;

  static defaultMem = 16384;
  static defaultArchivalMem = 32768;
  static rpcDaemonMem = 2048;

  static generateConfig(client = Ethereum.clients[0], network = NetworkType.MAINNET, peerPort = Ethereum.defaultPeerPort[NetworkType.MAINNET], rpcPort = Ethereum.defaultRPCPort[NetworkType.MAINNET]): string {
    switch (client) {
      case NodeClient.GETH:
        return coreConfig
          .replace('{{PEER_PORT}}', peerPort.toString(10))
          .replace('{{RPC_PORT}}', rpcPort.toString(10))
          .trim();
      default:
        return '';
    }
  }

  _rpcInstance?: ChildProcess;

  id: string;
  rpcDaemonId: string;
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
  dockerRpcDaemonCPUs = Ethereum.rpcDaemonCPUs;
  dockerRpcDaemonMem = Ethereum.rpcDaemonMem;
  dataDir = '';
  walletDir = '';
  configPath = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  role = Ethereum.roles[0];

  constructor(data: EthCryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.rpcDaemonId = this.id + '-rpc';
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Ethereum.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Ethereum.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Ethereum.clients[0];
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.walletDir;
    this.configPath = data.configPath || this.configPath;
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
    this.dockerRpcDaemonCPUs = data.dockerRpcDaemonCPUs || this.dockerRpcDaemonCPUs;
    this.dockerRpcDaemonMem = data.dockerRpcDaemonMem || this.dockerRpcDaemonMem;
    this.role = data.role || this.role;

    if (this.client === NodeClient.ERIGON) {
      this.archival = true;
    }

    if (this.archival) {
      this.dockerCPUs = data.dockerCPUs || Ethereum.defaultArchivalCPUs;
      this.dockerMem = data.dockerMem || Ethereum.defaultArchivalMem;
    } else {
      this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
      this.dockerMem = data.dockerMem || this.dockerMem;
    }

    if (docker)
      this._docker = docker;
  }

  async start(): Promise<ChildProcess | Array<ChildProcess>> {
    const versions = Ethereum.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];

    if (!versionData) throw new Error(`Unknown version ${this.version}`);

    switch (this.client) {
      case NodeClient.ERIGON:
        this._logOutput(JSON.stringify(versionData));
        return this._startErigon(versionData);

      case NodeClient.GETH:
        return this._startGeth(versionData);
    }

    throw new Error(`Cannot start ETH node for unknown client: ${this.client}`);
  }

  async _startGeth(versionData: EthVersionDockerImage): Promise<ChildProcess> {
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      configPath: containerConfigPath,
    } = versionData;
    let args = [
      '-i',
      '--rm',
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '-p', `${this.rpcPort}:${this.rpcPort}`,
      '-p', `${this.peerPort}:${this.peerPort}`,
    ];
    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    args = [ ...args, '-v', `${dataDir}:${containerDataDir}` ];
    await fs.ensureDir(dataDir);

    const walletDir = this.walletDir || path.join(tmpdir, uuid());
    args = [ ...args, '-v', `${walletDir}:${containerWalletDir}` ];
    await fs.ensureDir(walletDir);

    const configPath = this.configPath || path.join(tmpdir, uuid());
    const configExists = await fs.pathExists(configPath);
    if (!configExists)
      await fs.writeFile(configPath, this.generateConfig(), 'utf8');
    args = [ ...args, '-v', `${configPath}:${containerConfigPath}` ];

    await this._docker.pull(this.dockerImage, str => this._logOutput(str));

    await this._docker.createNetwork(this.dockerNetwork);
    const instance = this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      args,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );
    this._instance = instance;
    return instance;
  }

  async _startErigon(versionData: EthVersionDockerImage): Promise<Array<ChildProcess>> {
    const { dataDir: containerDataDir } = versionData;

    this._logOutput(JSON.stringify(versionData));
    if (!versionData.generateRpcRuntimeArgs) {
      throw new Error('missing generateRpcRuntimeArgs function on version data that is required to run Erigon client');
    }

    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    await fs.ensureDir(dataDir);

    const nodeContainerArgs = [
      '-i',
      '--rm',
      '--user=root:root',
      '--memory', this.dockerMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.id,
      '--network', this.dockerNetwork,
      '--expose', '9090', // allow rpcdaemon access this container without need to expose on the host.
      '-p', `${this.peerPort}:${this.peerPort}/tcp`,
      '-p', `${this.peerPort}:${this.peerPort}/udp`,
      '-v', `${dataDir}:${containerDataDir}`,
    ];

    const rpcContainerArgs = [
      '-i',
      '--rm',
      '--memory', this.dockerRpcDaemonMem.toString(10) + 'MB',
      '--cpus', this.dockerCPUs.toString(10),
      '--name', this.rpcDaemonId,
      '--network', this.dockerNetwork,
      '-p', `${this.rpcPort}:8545`,
    ];

    await this._docker.pull(this.dockerImage, str => this._logOutput(str));
    await this._docker.createNetwork(this.dockerNetwork);

    const nodeInstance = this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      nodeContainerArgs,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );

    const rpcArgs = versionData.generateRpcRuntimeArgs(this);

    const rpcInstance = this._docker.run(
      this.dockerImage + rpcArgs,
      rpcContainerArgs,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );

    this._instance = nodeInstance;
    this._rpcInstance = rpcInstance;

    return [ nodeInstance, rpcInstance ];
  }

  generateConfig(): string {
    return Ethereum.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

  async rpcGetVersion(): Promise<string> {
    try {
      this._runCheck('rpcGetVersion');
      const { body } = await request
        .post(this.endpoint())
        .set('Accept', 'application/json')
        .auth(this.rpcUsername, this.rpcPassword)
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '2.0',
          method: 'web3_clientVersion',
          params: [],
        });
      const { result = '' } = body;

      if (this.client === NodeClient.ERIGON) {
        const matches = result.split('/');
        if (!matches || !matches.length || matches.length < 1) return '';
        return matches[1];
      } else {
        // first, check for RC matches
        let matches = result.match(/v(\d+\.\d+\.\d+-rc.+?)-/i);
        if (!matches)
          // check for regular matches
          matches = result.match(/v(\d+\.\d+\.\d+)/);
        if (matches && matches.length > 1) {
          return matches[1];
        } else if (result.length) {
          return result;
        } else {
          return '';
        }
      }

    } catch (err) {
      this._logError(err);
      return '';
    }
  }

  async rpcGetBlockCount(): Promise<string> {
    let blockHeight;
    try {
      this._runCheck('rpcGetBlockCount');
      const res = await request
        .post(this.endpoint())
        .set('Accept', 'application/json')
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '2.0',
          method: 'eth_syncing',
          params: [],
        });
      if (res.body.result === false) {
        const res = await request
          .post(this.endpoint())
          .set('Accept', 'application/json')
          .timeout(this._requestTimeout)
          .send({
            id: '',
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
          });
        const currentBlock = res.body.result;
        const blockNum = parseInt(currentBlock, 16);
        blockHeight = blockNum > 0 ? blockNum.toString(10) : '';
      } else {
        const { currentBlock } = res.body.result;
        const blockNum = parseInt(currentBlock, 16);
        blockHeight = blockNum > 0 ? blockNum.toString(10) : '';
      }
    } catch (err) {
      this._logError(err);
      blockHeight = '';
    }
    return blockHeight || '';
  }

  _makeSyncingCall(): Promise<any> {
    return request
      .post(this.endpoint())
      .set('Accept', 'application/json')
      .timeout(this._requestTimeout)
      .send({
        id: '',
        jsonrpc: '2.0',
        method: 'eth_syncing',
        params: [],
      });
  }

  async getStatus(): Promise<string> {
    let status;
    try {
      if (this.remote) {
        const version = await this.rpcGetVersion();
        status = version ? Status.RUNNING : Status.STOPPED;
      } else {
        const stats = await this._docker.containerInspect(this.id);
        status = stats.State.Running ? Status.RUNNING : Status.STOPPED;
      }
    } catch (err) {
      status = Status.STOPPED;
    }

    if (status !== Status.STOPPED) {
      try {
        const res = await this._makeSyncingCall();
        if (res.body.result !== false)
          status = Status.SYNCING;
      } catch (err) {
        // do nothing with the error
      }
    }

    return status;
  }

  async _stopRpcDaemon(): Promise<void> {
    return new Promise<void>(resolve => {
      if (this._rpcInstance) {
        const { exitCode } = this._rpcInstance;
        if (typeof exitCode === 'number') {
          resolve();
        } else {
          this._rpcInstance.on('exit', () => {
            clearTimeout(timeout);
            setTimeout(() => {
              resolve();
            }, 1000);
          });
          this._rpcInstance.kill();
          const timeout = setTimeout(() => {
            this._docker.stop(this.rpcDaemonId)
              .then(() => {
                setTimeout(() => {
                  resolve();
                }, 1000);
              })
              .catch(err => {
                this._logError(err);
                resolve();
              });
          }, 30000);
        }
      } else {
        resolve();
      }
    });
  }

  async stop(): Promise<void> {
    if (this.client === NodeClient.GETH) {
      return super.stop();
    }

    const stopPromises = [
      this._stopRpcDaemon(),
      super.stop(),
    ];

    try {
      const results = await Promise.allSettled(stopPromises);
      const rpcStopResult = results[0];
      if (rpcStopResult.status !== 'fulfilled') {
        this._logError(
          new Error(`Erigon RPC Daemon Errored when trying to stop it. ${rpcStopResult.reason}`),
        );
      }

      const erigonStopResult = results[1];
      if (erigonStopResult.status !== 'fulfilled') {
        this._logError(
          new Error(`Erigon Node Errored when trying to stop it. ${erigonStopResult.reason}`),
        );
      }
    } catch (e) {
      this._logError(e);
    }
  }

  async getMemUsage(): Promise<[ usagePercent: string, used: string, allocated: string ]> {
    if (this.client !== NodeClient.ERIGON) return super.getMemUsage();

    try {
      this._runCheck('getMemUsage');
      const erigonContainerStats = await this._docker.containerStats(this.id);
      const rpcContainerStats = await this._docker.containerStats(this.rpcDaemonId);

      const erigonCPUsPercent = Number(erigonContainerStats.MemPerc.replace('%', ''));
      const rpcDaemonCPUsPercent = Number(rpcContainerStats.MemPerc.replace('%', ''));
      const percent = `${erigonCPUsPercent + rpcDaemonCPUsPercent}%`;

      const erigon = erigonContainerStats.MemUsage.split('/').map((s: string): string => s.trim());
      const rpcDaemon = rpcContainerStats.MemUsage.split('/').map((s: string): string => s.trim());

      if (erigon.length > 1 && rpcDaemon.length > 1) {
        const usage = aggregateStats([ erigon[0], rpcDaemon[0] ]);
        const allocate = aggregateStats([ erigon[1], rpcDaemon[1] ]);

        return [ percent, usage, allocate ];
      } else {
        throw new Error('Split containerStats/MemUsage length less than two.');
      }
    } catch (err) {
      this._logError(err);
      return [ '0', '0', '0' ];
    }
  }

  async getCPUUsage(): Promise<string> {
    if (this.client !== NodeClient.ERIGON) return super.getCPUUsage();

    try {
      this._runCheck('getCPUUsage');
      const erigonContainerStats = await this._docker.containerStats(this.id);
      const rpcContainerStats = await this._docker.containerStats(this.rpcDaemonId);

      const erigonCPUsPercent = Number(erigonContainerStats.MemPerc.replace('%', ''));
      const rpcDaemonCPUsPercent = Number(rpcContainerStats.MemPerc.replace('%', ''));

      return `${Math.round((erigonCPUsPercent + rpcDaemonCPUsPercent + Number.EPSILON) * 100) / 100}%`;
    } catch (err) {
      this._logError(err);
      return '0';
    }
  }
}
