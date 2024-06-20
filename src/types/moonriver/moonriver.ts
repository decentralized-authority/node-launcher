import { CryptoNodeData, VersionDockerImage } from '../../interfaces/crypto-node';
import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role, Status } from '../../constants';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import { v4 as uuid} from 'uuid';
import request from 'superagent';
import path from 'path';
import os from 'os';
import { Moonbeam } from '../moonbeam/moonbeam';
import { filterVersionsByNetworkType, timeout } from '../../util';
import { FS } from '../../util/fs';


export class Moonriver extends Moonbeam {

  static versions(client: string, networkType: string): VersionDockerImage[] {
    client = client || Moonriver.clients[0];
    let versions: VersionDockerImage[];
    switch(client) {
      case NodeClient.CORE:
        versions = [
          {
            version: '0.24.0',
            clientVersion: '0.24.0',
            image: 'icculp/moonbeam:v0.24.0',
            dataDir: '/moonbeam/data', 
            walletDir: '/moonbeam/keystore',
            configDir: '/moonbeam/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: CryptoNodeData): string {
              const { network = '' } = data;
              return ` --port ${data.peerPort} \
              --rpc-port ${data.rpcPort} \
              --unsafe-rpc-external \
              --rpc-cors=all \
              --ws-port 9944 \
              --execution wasm \
              --wasm-execution compiled \
              --pruning=archive \
              --state-cache-size 0 \
              --db-cache 8192 \
              --base-path ${this.dataDir} \
              --keystore-path ${this.walletDir} \
              --chain moonriver \
              --sync full \
              --name NodeLauncher \
              `;
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
    [NetworkType.MAINNET]: 9933,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 30333,
  };

  static defaultCPUs = 8;

  static defaultMem = 16384;

  id: string;
  ticker = 'movr';
  name = 'Moonriver';
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
  dockerCPUs = Moonriver.defaultCPUs;
  dockerMem = Moonriver.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  remote = false;
  remoteDomain = '';
  remoteProtocol = '';
  role = Moonriver.roles[0];

  constructor(data: CryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Moonriver.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Moonriver.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Moonriver.clients[0];
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
    const versions = Moonriver.versions(this.client, this.network);
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
    const versions = Moonriver.versions(this.client, this.network);
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
      const configPath = path.join(configDir, Moonriver.configName(this));
      const configExists = await fs.pathExists(configPath);

      args = [...args, '-v', `${configDir}:${containerConfigDir}`];

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

}
