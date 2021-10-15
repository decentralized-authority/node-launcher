import crypto from 'crypto';
import { VersionDockerImage } from '../interfaces/crypto-node';

export const generateRandom = (size = 32): string => {
  return crypto.randomBytes(size).toString('hex');
};

export const timeout = (length = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, length));
};

export const filterVersionsByNetworkType = (networkType: string, versions: VersionDockerImage[]): VersionDockerImage[] => {
  return versions
    .filter(v => v.networks.includes(networkType));
};
