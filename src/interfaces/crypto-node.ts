import { ChildProcess } from 'child_process';
import { Docker } from '../util/docker';

export interface VersionDockerImage {
  version: string;
  clientVersion: string;
  image: string;
  dataDir: string;
  walletDir: string;
  logDir?: string;
  configPath: string;
  networks: string[],
  generateRuntimeArgs(data: CryptoNodeData): string;
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
  rpcPort?: number;
  rpcUsername?: string;
  rpcPassword?: string;
  client?: string;
  dockerCPUs?: number;
  dockerMem?: number;
  dockerNetwork?: string;
  dataDir?: string;
  walletDir?: string;
  configPath?: string;
  domain?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
  remote?: boolean;
  remoteDomain?: string;
  remoteProtocol?: string;
  remotePort?: number;
}

export interface CryptoNode {
  _docker: Docker,
  _instance?: ChildProcess;
  _logError(message: string): void;
  _logOutput(output: string): void;
  _logClose(exitCode: number): void;
  _requestTimeout: number;
  start(): Promise<ChildProcess>;
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
}
