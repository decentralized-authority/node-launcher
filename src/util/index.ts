import crypto from 'crypto';
import { VersionDockerImage } from '../interfaces/crypto-node';
import { spawn } from 'child_process';

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

export const splitVersion = (version: string): [number, number, number] => {
  const split = version.split('.');
  const [ numStr0, numStr1, numStr2 ] = split;
  const num0 = Number(numStr0) || 0;
  const num1 = Number(numStr1) || 0;
  const num2 = Number(numStr2) || 0;
  return [num0, num1, num2];
};

export const getTmpfs = (): Promise<string> => {
  return new Promise(resolve => {
    const tmpfsPatt = /^tmpfs.+?(\/run\/user.+?)\s/;
    const instance = spawn('mount');
    let output = '';
    instance.stdout.on('data', data => {
      output += data.toString();
    });
    instance.on('close', () => {
      const outputArr = output
        .split('\n')
        .map(s => s.trim())
        .map(s => {
          const matches = s.match(tmpfsPatt);
          return matches ? matches[1] : '';
        })
        .filter(s => !!s);
      resolve(outputArr[0] || '');
    });
    instance.on('error', () => {
      resolve('');
    });
  });
};
