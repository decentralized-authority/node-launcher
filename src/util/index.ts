import crypto from 'crypto';
import { VersionDockerImage } from '../interfaces/crypto-node';

export const aggregateStats = function(values: Array<string>): string {
  const pattern = /(\d*[.,]?\d*)([GM]iB)/;

  const parsedValues: Array<Array<number|string>> = values.map((value) => {
    const matches = value.match(pattern);
    if(!matches || !matches.length || matches.length < 2) return ['0', 'MiB'];
    return [Number(matches[1]), matches[2]];
  });
  const hasGiB = parsedValues.some((values: Array<number | string>) => values[1] === 'GiB');
  let totalInMiB = parsedValues.reduce((acc: number, cur: Array<number | string>) => {
    const amount = cur[0] as number;
    const v = cur[1] === 'GiB' ? amount / 1024 : amount;
    return acc + v;
  }, 0);
  if (hasGiB) totalInMiB = totalInMiB * 1024;
  return `${Math.round((totalInMiB + Number.EPSILON) * 100) / 100}${hasGiB ? 'GiB' : 'MiB'}`;
};

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
