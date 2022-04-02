import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { filterVersionsByNetworkType, generateRandom } from '../../util';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import path from 'path';
import os from 'os';
import { Bitcoin } from '../bitcoin/bitcoin';
import { FS } from '../../util/fs';

const coreConfig = `
{
  "api-admin-enabled": true,
  "api-auth-required": false,
  "api-health-enabled": true,
  "api-info-enabled": true,
  "index-enabled": true,
  "db-dir": "/root/db",
  "db-enabled": true,
  "log-dir": "/root/logs",
  "http-host": "",
  "http-port": {{RPC_PORT}},
  "staking-port": {{PEER_PORT}},
  "network-id": "mainnet",
  "keystore-directory": "/root/keystore"
}
`;

export class Avalanche extends Bitcoin {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Avalanche.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '1.7.9',
            clientVersion: '1.7.9',
            image: 'avaplatform/avalanchego:v1.7.9',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.7.4',
            clientVersion: '1.7.4',
            image: 'avaplatform/avalanchego:v1.7.4',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.7.3',
            clientVersion: '1.7.3',
            image: 'avaplatform/avalanchego:v1.7.3',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.7.2',
            clientVersion: '1.7.2',
            image: 'avaplatform/avalanchego:v1.7.2',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.7.1',
            clientVersion: '1.7.1',
            image: 'avaplatform/avalanchego:v1.7.1',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.6.5',
            clientVersion: '1.6.5',
            image: 'avaplatform/avalanchego:v1.6.5',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.6.3',
            clientVersion: '1.6.3',
            image: 'avaplatform/avalanchego:v1.6.3',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.5.3',
            clientVersion: '1.5.3',
            image: 'avaplatform/avalanchego:v1.5.3',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
            },
          },
          {
            version: '1.4.9',
            clientVersion: '1.4.9',
            image: 'avaplatform/avalanchego:v1.4.9',
            dataDir: '/root/db',
            walletDir: '/root/keystore',
            logDir: '/root/logs',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              return ` --config-file=${path.join(this.configDir, Avalanche.configName(data))}`;
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
    [NetworkType.MAINNET]: 9650,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 9651,
  };

  static defaultCPUs = 8;

  static defaultMem = 16384;

  static generateConfig(client = Avalanche.clients[0], network = NetworkType.MAINNET, peerPort = Avalanche.defaultPeerPort[NetworkType.MAINNET], rpcPort = Avalanche.defaultRPCPort[NetworkType.MAINNET]): string {
    switch(client) {
      case NodeClient.CORE:
        return coreConfig
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
  ticker = 'avax';
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
  dockerCPUs = Avalanche.defaultCPUs;
  dockerMem = Avalanche.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  role = Avalanche.roles[0];

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Avalanche.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Avalanche.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Avalanche.clients[0];
    this.dockerCPUs = data.dockerCPUs || this.dockerCPUs;
    this.dockerMem = data.dockerMem || this.dockerMem;
    this.dockerNetwork = data.dockerNetwork || this.dockerNetwork;
    this.dataDir = data.dataDir || this.dataDir;
    this.walletDir = data.walletDir || this.dataDir;
    this.configDir = data.configDir || this.configDir;
    this.remote = data.remote || this.remote;
    this.remoteDomain = data.remoteDomain || this.remoteDomain;
    this.remoteProtocol = data.remoteProtocol || this.remoteProtocol;
    const versions = Avalanche.versions(this.client, this.network);
    this.version = data.version || (versions && versions[0] ? versions[0].version : '');
    const versionObj = versions.find(v => v.version === this.version) || versions[0] || {};
    this.clientVersion = data.clientVersion || versionObj.clientVersion || '';
    this.dockerImage = this.remote ? '' : data.dockerImage ? data.dockerImage : (versionObj.image || '');
    this.archival = data.archival || this.archival;
    this.role = data.role || this.role;
    if(docker) {
      this._docker = docker;
      this._fs = new FS(docker);
    }
  }

  async start(): Promise<ChildProcess[]> {
    const fs = this._fs;
    const versions = Avalanche.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const {
      dataDir: containerDataDir,
      walletDir: containerWalletDir,
      logDir: containerLogDir,
      configDir: containerConfigDir,
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
      '--entrypoint', '/avalanchego/build/avalanchego',
    ];
    const tmpdir = os.tmpdir();
    const dataDir = this.dataDir || path.join(tmpdir, uuid());
    const dbDir = path.join(dataDir, 'db');
    const logDir = path.join(dataDir, 'logs');
    args = [...args, '-v', `${dbDir}:${containerDataDir}`];
    args = [...args, '-v', `${logDir}:${containerLogDir}`];
    await fs.ensureDir(dataDir);
    await fs.ensureDir(dbDir);
    await fs.ensureDir(logDir);

    const walletDir = this.walletDir || path.join(tmpdir, uuid());
    args = [...args, '-v', `${walletDir}:${containerWalletDir}`];
    await fs.ensureDir(walletDir);

    const configDir = this.configDir || path.join(tmpdir, uuid());
    await fs.ensureDir(configDir);
    const configPath = path.join(configDir, Avalanche.configName(this));
    const configExists = await fs.pathExists(configPath);
    if(!configExists)
      await fs.writeFile(configPath, this.generateConfig(), 'utf8');
    args = [...args, '-v', `${configDir}:${containerConfigDir}`];

    await this._docker.createNetwork(this.dockerNetwork);
    const instance = this._docker.run(
      this.dockerImage + versionData.generateRuntimeArgs(this),
      args,
      output => this._logOutput(output),
      err => this._logError(err),
      code => this._logClose(code),
    );
    this._instance = instance;
    this._instances = [
      instance,
    ];
    return this.instances();
  }

  generateConfig(): string {
    return Avalanche.generateConfig(
      this.client,
      this.network,
      this.peerPort,
      this.rpcPort);
  }

  async rpcGetVersion(): Promise<string> {
    try {
      this._runCheck('rpcGetVersion');
      const { body } = await request
        .post(`${this.endpoint()}/ext/info`)
        .set('Accept', 'application/json')
        .auth(this.rpcUsername, this.rpcPassword)
        .timeout(this._requestTimeout)
        .send({
          id: '',
          jsonrpc: '2.0',
          method: 'info.getNodeVersion',
          params: [],
        });
      const { result = {} } = body;
      const { version = '' } = result;
      const splitResult = version.split('/');
      if(splitResult.length > 1) {
        return splitResult[1];
      } else {
        return '';
      }
    } catch(err) {
      this._logError(err);
      return '';
    }
  }

  async isBootstrapped(chain: string): Promise<boolean> {
    try {
      const res = await request
        .post(`${this.endpoint()}/ext/info`)
        .set('Accept', 'application/json')
        .timeout(this._requestTimeout)
        .send({
          id: '1',
          jsonrpc: '2.0',
          method: 'info.isBootstrapped',
          params: {
            chain,
          },
        });
      if(res.body && res.body.result) {
        return res.body.result.isBootstrapped || false;
      } else {
        return false;
      }
    } catch(err) {
      this._logError(err);
      return false;
    }
  }

  async getPHeight(): Promise<string> {
    try {
      const res = await request
        .post(`${this.endpoint()}/ext/P`)
        .set('Accept', 'application/json')
        .timeout(this._requestTimeout)
        .send({
          jsonrpc: '2.0',
          method: 'platform.getHeight',
          params: {},
        });
      const { height = '0' } = res.body.result;
      return Number(height) > 0 ? height : '';
    } catch(err) {
      this._logError(err);
      return '';
    }
  }

  async getXHeight(): Promise<string> {
    return '';
  }

  async getCHeight(): Promise<string> {
    try {
      const res = await request
        .post(`${this.endpoint()}/etc/bc/C/rpc`)
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
      return blockNum > 0 ? blockNum.toString(10) : '';
    } catch(err) {
      this._logError(err);
      return '';
    }
  }

  async rpcGetBlockCount(): Promise<string> {
    try {
      this._runCheck('rpcGetBlockCount');
      const [ p, c, x ] = await Promise.all([
        this.isBootstrapped('P'),
        this.isBootstrapped('X'),
        this.isBootstrapped('C'),
      ]);
      if(!p || !c || !x) {
        const { text = '' } = await request
          .post(`${this.endpoint()}/ext/metrics`)
          .timeout(this._requestTimeout);
        const splitText = text
          .split('\n')
          .map(s => s.trim())
          .filter(s => s);
        // const [ pCount, cCount, xCount ] = ['avalanche_P_bs_fetched', 'avalanche_C_bs_fetched', 'avalanche_X_bs_fetched_vts']
        const countArr = ['avalanche_P_bs_fetched', 'avalanche_C_bs_fetched', 'avalanche_X_bs_fetched_vts']
          .map(key => {
            let count = 0;
            const patt = new RegExp(`^${key}.+?(\\d+)$`);
            const countIndex = splitText.findIndex(s => patt.test(s));
            if(countIndex > -1) {
              const matches = splitText[countIndex].match(patt);
              const countStr = matches ? matches[1] : p;
              count = Number(countStr);
            }
            return count;
          });
        return [countArr].map(count => String(count)).join(',');
      } else {
        const [
          pHeight,
          xHeight,
          cHeight,
        ] = await Promise.all([
          this.getPHeight(),
          this.getXHeight(),
          this.getCHeight(),
        ]);
        return `${pHeight}/${xHeight}/${cHeight}`;
      }
    } catch(err) {
      this._logError(err);
      return '';
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
        status = stats.State.Running ? Status.RUNNING : Status.STOPPED;
      }
    } catch(err) {
      status = Status.STOPPED;
    }
    if(status !== Status.STOPPED) {
      try {
        const [ p, c, x ] = await Promise.all([
          this.isBootstrapped('P'),
          this.isBootstrapped('X'),
          this.isBootstrapped('C'),
        ]);
        if(!p || !c || !x)
          status = Status.SYNCING;
      } catch(err) {
        // do nothing with the error
      }
    }

    return status;
  }

}
