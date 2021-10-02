import { ChildProcess } from 'child_process';
import { Docker } from '../util/docker';

export interface VersionDockerImage {
  version: string;
  image: string;
  dataDir: string;
  walletDir: string;
  logDir?: string;
  configPath: string;
  generateRuntimeArgs(data: CryptoNodeData): string;
}

export interface CryptoNodeData {
  id?: string;
  ticker?: string;
  version?: string;
  dockerImage?: string;
  network?: string;
  peerPort?: number;
  privKeyPass?: string;
  rpcPort?: number;
  rpcUsername?: string;
  rpcPassword?: string;
  client?: string;
  dockerCpus?: number;
  dockerMem?: number;
  dockerNetwork?: string;
  dataDir?: string;
  walletDir?: string;
  configPath?: string;
  domain?: string;
  address?: string;
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
  toObject(): CryptoNodeData;
  generateConfig(): string;
  rpcGetVersion(): Promise<string>;
  rpcGetBlockCount(): Promise<number>;
  getCPUUsage(): Promise<string>;
  getMemUsage(): Promise<[usagePercent: string, used: string, allocated: string]>;
  getStartTime(): Promise<string>;
  getStatus(): Promise<string>;
}

export abstract class CryptoNodeStatic {
  static versions: VersionDockerImage[];
  static nodeTypes: string[];
  static networkTypes: string[];
  static defaultPeerPort: any;
  static defaultRPCPort: any;
  static defaultCPUs: number;
  static defaultMem: number;
  static generateConfig(client: string, network: string, peerPort: number, rpcPort: number, rpcUsername: string, rpcPassword: string): string {
    return '';
  }
}
