import { defaultDockerNetwork, NetworkType, NodeClient, NodeType, Role } from '../../constants';
import { v4 as uuid } from 'uuid';
import { Docker } from '../../util/docker';
import { ChildProcess } from 'child_process';
import os from 'os';
import path from 'path';
import * as nethermindConfig from '../ethereum/config/nethermind';
import { FS } from '../../util/fs';
import {
  ContainerService,
  Ethereum,
  EthereumCryptoNodeData,
  EthereumVersionDockerImage, Services, Validators,
} from '../ethereum/ethereum';
import Web3 from 'web3';
import { EncryptedKeystore } from '../../util/crypto';

export class Xdai extends Ethereum {

  static versions(client: string, networkType: string): EthereumVersionDockerImage[] {
    client = client || Xdai.clients[0];
    let versions: EthereumVersionDockerImage[];
    switch(client) {
      case NodeClient.NETHERMIND:
        versions = [
          {
            version: '1.14.7',
            clientVersion: '1.14.7',
            image: 'nethermind/nethermind:1.14.7',
            dataDir: '/nethermind/nethermind_db',
            walletDir: '/nethermind/keystore',
            configDir: '/nethermind/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              return ` --configsDirectory ${this.configDir} --config xdai`;
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
            validatorImage: '',
            dataDir: '/root/data',
            walletDir: '/root/keystore',
            configDir: '/root/config',
            networks: [NetworkType.MAINNET],
            breaking: false,
            generateRuntimeArgs(data: EthereumCryptoNodeData): string {
              const { consensusRPCPort, consensusPeerPort, network, id, rpcPort, authPort } = data;
              let network_ = network || '';
              let  checkpointSyncUrl = '';
              let bootnodes = '';
              if (network == NetworkType.MAINNET) {
                checkpointSyncUrl = 'https://checkpoint.gnosischain.com';
                network_ = 'gnosis';
                bootnodes = '--boot-nodes=enr:-Ly4QClooKhmB409-xLE52rTmC2h9kZBO_VFXR-kjqLDdduuZoxsjfwTxa1jscQMBpqmezG_JCwPpEzEYRM_1UCy-0gCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKXoiruJc2VjcDI1NmsxoQLLYztVAaOL2dhsQf884Vth9ro6n9p2yj-osPfZ0L_NwYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QHO5_3Zuosjt9IJQF3ovGroSWyB4rMZFUulOl5R5PkjcfVwtYewEp2TvUpo9tvHYMGKpDxgAYmjjTJcGasqn9uoCh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhI_GnBiJc2VjcDI1NmsxoQJqvGdusfukoXNx3F84umajVgkfVs0wasHeY45qcYgwf4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QPd8v1jzDOHuEAEJ-NPgbLgRRbsuuz4KZOSZ2YiIaD0dQ-BMbbzEw0Cix5wst0suFVrsrB73dg0_980zpbKKzzEBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhJ_f1T2Jc2VjcDI1NmsxoQNdZWlOxiBbJltPxilQgdllvE_cNF6sC1bpyRUyWegVjohzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QAOrFTIBlS__dwh0hhMLcGB-mbRTgMJc1P4MfMyd15-dX75_TBq7RsqWMLsZzdidoU41zO0fvI8-w7N8dHrpA54Bh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-woiJc2VjcDI1NmsxoQKeJ-BUNBGaVYX1MgnAsvjgJpGXVKgEMZa1_FMG8fTYl4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QM0mWWtb978oZpY46_DVEY9SOkyDKprDlu6NyI6cjRX0TDYGp9txkyREyRw3mIkXWFDsdhONUZqKzjD09lp3iLIBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-wMOJc2VjcDI1NmsxoQNXBYeo4Oa9Hksc247JWokwgpZAJzZxWMMK1KG3UYl4w4hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QDnJWKfiGm6U6SyLr8r-BfM6zHlI90VPsgbxiXb6GhIUVcDmeGw_IRxLpUAelnu2sH8TtF9uenfIGdAshoUZHAUBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKdj0Q6Jc2VjcDI1NmsxoQIrmmOVYy87sV-n8x8QxfCKLsf_eKqwk6Rl5Gj-YLV8wYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-L24QJHzedzjOM6Xm53qSdrbP635LvqpxFCJy_2T84rZvVVjV81kS_kRKp7vV_PFPS2EHdSzpXtDMJCugvzdhjRZeGkGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhIm45FOJc2VjcDI1NmsxoQPHxbRx1Ev72MVVUergKeLznxrchLhB3lK9ljWCbCuGWYhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-L24QK00qalnMGv7PVg5k9Z7OjPFhIFoHLm6SDP8DjKOgFO5aUHzCqecoA9S3Y_0nI8mOF8sF1mYqYEE7byacE1Vq6YGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhKRcYG-Jc2VjcDI1NmsxoQPUtWI-6bkId_18Hy0KCautFQ5GJD-f2cgYCqNS5EekRIhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-L24QPdWmlPHi-0fQKptAjtkhKG50novgUHWeP5amyi_lGSWcQPAahWl7Ci3kW2p1Sd6WRtqlgkxSyvc6wioeaQl9ZIGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhLI-xGiJc2VjcDI1NmsxoQLNCuDR6ik6JcTW8uAsoPn6AMgtNvGq65kCnJmA2HY2JIhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-L24QICiK4pSRAOgkO7R3yQVbjJXGVt1vbdvXsom0yA-UqlMIHO98f8tZyEKbz0lrgrdy89Vw_agSKzuGS7Hgi3QsygGh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhJ_f1aaJc2VjcDI1NmsxoQKyGQswAJ5pJaPF9WRpGU4Lp8CdxiSlm8AHJsr1naz_7YhzeW5jbmV0c4gAAAAAAAAAAIN0Y3CCIyg,enr:-KG4QKWOgedErRLsanl1AUjTFnHB-RO9OsyFP-vtSrX2VGxRBdvoJVrzBJwgGYLIBiDjqy0eYJ2r8ZosAjkWhQ02koUGhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39WdiXNlY3AyNTZrMaEDYAuZlJpKwWdGtbSrVgy6N5sdMjehVglGMGGkBCFg_VeDdGNwgiMog3VkcIIjKA,enr:-KG4QBart9YQV5Ju3EMxUUnJ0ntgYf7J6jDbEPySiR7R8gJ9DcTp22gArHqWSMQVyt0-TMnuZrZQCprcaka5J8B9JN8GhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39G5iXNlY3AyNTZrMaED13MHlUcbr4978YYNRurZtykey8gTY_O5pQ4a427ZICuDdGNwgiMog3VkcIIjKA,enr:-KG4QLk-EkZCAjhMaBSlB4r6Icrz137hIx6WXg5AKIXQl9vkPt876WxIhzu8dVPCLVfaPzjAsIjXeBUPy2E3VH4QEuEGhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39n5iXNlY3AyNTZrMaECtocMlfvwxqouGi13SSdG6Tkn3shkyBQt1BIpF0fhXc-DdGNwgiMog3VkcIIjKA,enr:-KG4QDXI2zubDpp7QowlafGwwTLu4w-gFztFYNnA6_I0vrpaS9bXQydY_Gh8Dc6c7cy9SHEi56HRfle9jkKIbSRQ2B8GhGV0aDKQgkvkMQIAAGT__________4JpZIJ2NIJpcISf39WiiXNlY3AyNTZrMaECZ2_0tLZ9kb0Wn-lVNcZEyhVG9dmXX_xzQXQq24sdbZiDdGNwgiMog3VkcIIjKA,enr:-LK4QPnudCfJYvcmV-LjJBU5jexY3QTdC1PepWK08OHb4w_BJ3OgFbh0Bc2nb1WRK6p2CBNOPAixpPrtAvmNQPgegDgBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpBW_bXgAQAAZP__________gmlkgnY0gmlwhJO2zMWJc2VjcDI1NmsxoQKk8-B9o94CY2UUK2bxPpl-T_yHmTtE7rAPaT26M4w09YN0Y3CCIyiDdWRwgiMo,enr:-LK4QArhQjC_S3CwptV7balWpNP5IVKweAqZzvq93vz_zN_ZSruOxBU5ECgqOBUFHO1nYUveOYVeiEKswg637rOURDABh2F0dG5ldHOIAAAAAAAAAACEZXRoMpBW_bXgAQAAZP__________gmlkgnY0gmlwhIm4t0GJc2VjcDI1NmsxoQIj9iJm4h7OAhhCoUcqfn41_fj9F7UfKnISj_-xqKH834N0Y3CCIyiDdWRwgiMo,enr:-Ly4QMU1y81COwm1VZgxGF4_eZ21ub9-GHF6dXZ29aEJ0oZpcV2Rysw-viaEKfpcpu9ZarILJLxFZjcKOjE0Sybs3MQBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhANLnx-Jc2VjcDI1NmsxoQKoaYT8I-wf2I_f_ii6EgoSSXj5T3bhiDyW-7ZLsY3T64hzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QJcPfzPTwhknVlYmCMYo1vtOqItLLV9iiydSuMYoCcJ6G38V6JiJaRNQUTR-1sivBsJIESP9A4KhoO_k9vOR9ZoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhBLGgjaJc2VjcDI1NmsxoQPKKRjNBuhorFa1FbCJ8xgkbhu5Jm-uYyafBiLIN-mIiYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QLjZUWdqUO_RwyDqCAccIK5-MbLRD6A2c7oBuVbBgBnWDkEf0UKJVAaJqi2pO101WVQQLYSnYgz1Q3pRhYdrlFoBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhANA8sSJc2VjcDI1NmsxoQK4TC_EK1jSs0VVPUpOjIo1rhJmff2SLBPFOWSXMwdLVYhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA,enr:-Ly4QKwX2rTFtKWKQHSGQFhquxsxL1jewO8JB1MG-jgHqAZVFWxnb3yMoQqnYSV1bk25-_jiLuhIulxar3RBWXEDm6EBh2F0dG5ldHOIAAAAAAAAAACEZXRoMpCCS-QxAgAAZP__________gmlkgnY0gmlwhAN-qZeJc2VjcDI1NmsxoQI7EPGMpecl0QofLp4Wy_lYNCCChUFEH6kY7k-oBGkPFIhzeW5jbmV0cwCDdGNwgiMog3VkcIIjKA';
              }
              return ` lighthouse beacon --http --eth1 --checkpoint-sync-url="${checkpointSyncUrl}" --datadir=/root/data --execution-endpoint=http://${id}:${authPort} --execution-jwt=/root/config/jwt.hex --port=${consensusPeerPort} --http-address=0.0.0.0 --http-allow-origin=* --http-port=${consensusRPCPort} --network=${network_.toLowerCase()}  ${bootnodes}`;
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
    NodeClient.NETHERMIND,
  ];

  static consensusClients = [
    NodeClient.LIGHTHOUSE,
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
    [NetworkType.MAINNET]: 8545,
  };

  static defaultPeerPort = {
    [NetworkType.MAINNET]: 30303,
  };

  static defaultAuthPort = {
    [NetworkType.MAINNET]: 8551,
  };

  static defaultConsensusRPCPort = {
    [NetworkType.MAINNET]: 3500,
  };

  static defaultConsensusPeerPort = {
    [NetworkType.MAINNET]: 1300,
  };

  static defaultCPUs = 8;

  static defaultMem = 16384;

  static generateConfig(client: Xdai|string = Xdai.clients[0], network = NetworkType.MAINNET, peerPort = Xdai.defaultPeerPort[NetworkType.MAINNET], rpcPort = Xdai.defaultRPCPort[NetworkType.MAINNET], consensus = false): string {
    let clientStr: string;
    let authPort = 0;
    let id, role;
    if(typeof client === 'string') {
      clientStr = client;
    } else {
      if(consensus) {
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
    }
    authPort = authPort || Ethereum.defaultAuthPort[network];
    let config = '';
    switch(clientStr) {
      case NodeClient.NETHERMIND:
        switch(network) {
          case NetworkType.MAINNET:
            config = nethermindConfig.xdai;
            break;
        }
        break;
      case NodeClient.LIGHTHOUSE: {
        config = '';
        break;
      }
      default:
        config = '';
    }
    return config
      .replace(/{{PEER_PORT}}/g, peerPort.toString(10))
      .replace('{{RPC_PORT}}', rpcPort.toString(10))
      .replace('{{AUTH_PORT}}', authPort.toString(10))
      .replace('{{NETWORK}}', network.toLowerCase())
      .trim();
  }

  static configName(data: EthereumCryptoNodeData, consensus = false): string {
    const { client, consensusClient } = data;
    switch(consensus ? consensusClient : client) {
      case NodeClient.NETHERMIND:
        return 'xdai.cfg';
      default:
        return 'config.toml';
    }
  }

  id: string;
  ticker = 'xdai';
  name = 'xDAI';
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
  dockerCPUs = Xdai.defaultCPUs;
  dockerMem = Xdai.defaultMem;
  dockerNetwork = defaultDockerNetwork;
  dataDir = '';
  walletDir = '';
  configDir = '';
  role = Xdai.roles[0];
  authPort: number;
  consensusPeerPort: number;
  consensusRPCPort: number;
  consensusDockerImage: string;
  validatorDockerImage: string;
  validatorRPCPort: number;
  passwordPath = '';
  eth1Address = '';
  validators: Validators;
  mnemonicEncrypted: EncryptedKeystore;
  jwt: string;

  constructor(data: EthereumCryptoNodeData, docker?: Docker) {
    super(data, docker);
    this.id = data.id || uuid();
    this.network = data.network || NetworkType.MAINNET;
    this.peerPort = data.peerPort || Xdai.defaultPeerPort[this.network];
    this.rpcPort = data.rpcPort || Xdai.defaultRPCPort[this.network];
    this.rpcUsername = data.rpcUsername || '';
    this.rpcPassword = data.rpcPassword || '';
    this.client = data.client || Xdai.clients[0];
    this.consensusClient = Xdai.consensusClients[0];
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
    const versions = Xdai.versions(this.client, this.network);
    const consensusVersions = Xdai.versions(this.consensusClient, this.network);
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

  async start(): Promise<ChildProcess[]> {
    const { consensusDockerImage, _fs: fs } = this;
    const versions = Xdai.versions(this.client, this.network);
    const versionData = versions.find(({ version }) => version === this.version) || versions[0];
    const consensusVersions = Xdai.versions(this.consensusClient, this.network);
    const consensusVersionData = consensusVersions.find(({ version }) => version === this.consensusVersion) || consensusVersions[0];
    if(!versionData)
      throw new Error(`Unknown version ${this.version}`);
    const running = await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.id);
    const consensusRunning = consensusDockerImage ? (await this._docker.checkIfRunningAndRemoveIfPresentButNotRunning(this.consensusDockerName())) : false;
    if(!running || !consensusRunning) {
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

      await fs.ensureDir(this.dataDir);
      await fs.ensureDir(this.walletDir);
      await fs.ensureDir(this.configDir);

      const configPath = path.join(this.configDir, Xdai.configName(this));
      const configExists = await fs.pathExists(configPath);
      if(!configExists)
        await fs.writeFile(configPath, this.generateConfig(), 'utf8');

      const jwtPath = path.join(this.configDir, 'jwt.hex');
      const jwtExists = await fs.pathExists(jwtPath);
      if(!jwtExists) {
        await fs.writeFile(jwtPath, this.jwt, 'utf8');
      }
      const consensus = true;
      const consensusConfigPath = path.join(this.configDir, Xdai.configName(this, consensus));
      const consensusConfigExists = await fs.pathExists(consensusConfigPath);
      if(!consensusConfigExists) {
        const consensusConfig = Xdai.generateConfig(this, this.network, this.consensusPeerPort, this.consensusRPCPort, consensus);
        await fs.writeFile(consensusConfigPath, consensusConfig, 'utf8');
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
      const services: Services = {
        [this.id]: executionService,
        [this.consensusDockerName()]: consensusService,
      } as Services;
      const composeConfig = {
        version: '3.1',
        services: services,
        networks: {
          [this.dockerNetwork]: {
            external: 'true',
          },
        },
      };
      const composeConfigPath = path.join(this.configDir, 'docker-compose.yml');
      await fs.writeJson(composeConfigPath, composeConfig, {spaces: 2});
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
      if(exitCode !== 0)
        throw new Error(`Docker-compose for ${this.id} et al with ${this.dockerImage} failed with exit code ${exitCode}`);

    } // end !running
    this._instances = await this.dockerAttach();
    this._instance = this._instances[0];
    return this.instances();
  }

  generateConfig(): string {
    return Xdai.generateConfig(this);
  }

}
