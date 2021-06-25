import crypto from 'crypto';

export const generateRandom = (size = 32): string => {
  return crypto.randomBytes(size).toString('hex');
};
