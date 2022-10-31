//import { mnemonicToEntropy } from 'bip39';
import * as crypto from 'crypto';
import { v4 as uuid} from 'uuid';


// export interface MndemonicKeystore {
//   id:
//   algorithm: 'aes-256-cbc';
//   salt: string;
//   ciphertext: string;
//   iv: string;
// }

// export interface kdfParams {
//   dklen: 32,
//   n: 262144,
//   r: 8,
//   p: 1,
//   salt: string
// }

export interface encryptedKeystore {
  id: string
  kdfFunction: string
  kdfParams: {
    dklen: number
    n: number
    r: number
    p: number
    salt: string
  }
  cipherFunction: string
  iv: Buffer;
  message: string
}
  // "checksum": {
  //   "function": "sha256",
  //   "params": {},
  //   "message": "cf1baa54b3dde880cf34cc15ac301990fbefcff32d147c35e6471282293fca68"
  // },

export function hexPrefix(pubkey: string): string {
    if (pubkey.startsWith('0x')) {
    return pubkey;
  } else {
    return '0x' + pubkey;
  }
}

export function encrypt(text: string, password: string, id = uuid()): encryptedKeystore {
  const encryptedMnemonic: encryptedKeystore = {  
    id: id,
    kdfFunction: "scrypt",
    kdfParams: {
      dklen: 32,
      n: 262144,
      r: 8,
      p: 1,
      salt: crypto.randomBytes(32).toString('hex')
    },
    cipherFunction: 'aes-256-cbc',
    iv: crypto.randomBytes(16),
    message: '',
    }
   const kdfParams = encryptedMnemonic.kdfParams;
   console.log(71, encryptedMnemonic)
   const passwordHash = crypto.scryptSync(password, 
                                          kdfParams.salt,
                                          kdfParams.dklen,
                                          {
                                            cost: kdfParams.n,
                                            blockSize: kdfParams.r,
                                            parallelization: kdfParams.p,
                                            maxmem: 128 * kdfParams.n * kdfParams.r * 2
                                          })
   const cipher = crypto.createCipheriv(encryptedMnemonic.cipherFunction, passwordHash, Buffer.from(encryptedMnemonic.iv));
   const encrypted = cipher.update(text);
   const encryptedData = Buffer.concat([encrypted, cipher.final()]);
   encryptedMnemonic.message = encryptedData.toString('hex')
   return encryptedMnemonic;
}

export function decrypt(encryptedMnemonic: encryptedKeystore, password: string): string {
  const kdfParams = encryptedMnemonic.kdfParams;
  const passwordHash = crypto.scryptSync(password, 
                                          kdfParams.salt,
                                          kdfParams.dklen,
                                          {
                                            cost: kdfParams.n,
                                            blockSize: kdfParams.r,
                                            parallelization: kdfParams.p,
                                            maxmem: 128 * kdfParams.n * kdfParams.r * 2
                                          })
  const encryptedText = Buffer.from(encryptedMnemonic.message, 'hex');
  const decipher = crypto.createDecipheriv(encryptedMnemonic.cipherFunction, passwordHash, Buffer.from(encryptedMnemonic.iv));
  const decryptedText = decipher.update(encryptedText);
  const decrypted = Buffer.concat([decryptedText, decipher.final()]);
  return decrypted.toString('utf8');
}

