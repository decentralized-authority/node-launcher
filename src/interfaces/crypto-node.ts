import { ChildProcess } from 'child_process';
import { Docker } from '../util/docker';

export interface VersionDockerImage {
  version: string;
  clientVersion: string;
  image: string;
  dataDir: string;
  walletDir: string;
  configDir: string;
  logDir?: string;
  networks: string[],
  breaking: boolean,
  generateRuntimeArgs(data: CryptoNodeData): string;
  upgrade?(data: CryptoNodeData): Promise<boolean>;
}
export interface CryptoNodeData {
  id?: string;
  ticker?: string;
  name?: string;
  version?: string;
  clientVersion?: string;
  archival?: boolean;
  dockerImage?: string;
  network?: string;
  peerPort?: number;
  privKeyPass?: string;
  key?: any; // encrypted key string or web3 keystore v3 object
  keyPass?: string;
  rpcPort?: number;
  rpcUsername?: string;
  rpcPassword?: string;
  client?: string;
  dockerCPUs?: number;
  dockerMem?: number;
  dockerNetwork?: string;
  dataDir?: string;
  walletDir?: string;
  configDir?: string;
  passwordPath?: string;
  domain?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  remote?: boolean;
  remoteDomain?: string;
  remoteProtocol?: string;
  remotePort?: number;
  role?: string;
  restartAttempts?: number
}

export interface CryptoNode {
  _docker: Docker,
  _instance?: ChildProcess;
  _logError(message: string): void;
  _logOutput(output: string): void;
  _logClose(exitCode: number): void;
  _requestTimeout: number;
  start(): Promise<ChildProcess[]>;
  stop(): void;
  isRunning(): Promise<boolean>;
  toObject(): CryptoNodeData;
  generateConfig(): string;
  endpoint(): string;
  rpcGetVersion(): Promise<string>;
  rpcGetBlockCount(): Promise<string>;
  getCPUUsage(): Promise<string>;
  getMemUsage(): Promise<[usagePercent: string, used: string, allocated: string]>;
  getStartTime(): Promise<string>;
  getStatus(): Promise<string>;
}

export abstract class CryptoNodeStatic {
  static nodeTypes: string[];
  static networkTypes: string[];
  static defaultPeerPort: any;
  static defaultRPCPort: any;
  static defaultCPUs: number;
  static defaultMem: number;
  static versions(client: string, network: string): VersionDockerImage[] {
    return [];
  }
  static generateConfig(client: string, network: string, peerPort: number, rpcPort: number, rpcUsername: string, rpcPassword: string): string {
    return '';
  }
  static configName(data: CryptoNodeData): string {
    return '';
  }
}

export interface ValidatorInfo {
  jailed: boolean;
  stakedAmount: string;
  unstakeDate: string;
  url: string;
  address: string;
  publicKey: string;
}