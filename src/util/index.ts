import crypto from 'crypto';

export const generateRandom = (size = 32): string => {
  return crypto.randomBytes(size).toString('hex');
};

export const timeout = (length = 0): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, length));
};
