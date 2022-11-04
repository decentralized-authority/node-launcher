import * as crypto from 'crypto';
import { v4 as uuid} from 'uuid';
import  { SecretKey } from '@chainsafe/blst';
import { Keystore } from '@chainsafe/bls-keystore';
import { deriveEth2ValidatorKeys, deriveKeyFromMnemonic } from '@chainsafe/bls-keygen';
//import   bls  from "@chainsafe/bls/blst-native";


export interface EncryptedKeystore {
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
  iv: string;
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

export function encrypt(text: string, password: string, id = uuid()): EncryptedKeystore {
  const encryptedKeystore: EncryptedKeystore = {  
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
    iv: crypto.randomBytes(16).toString('hex'),
    message: '',
    }
   const kdfParams = encryptedKeystore.kdfParams;
   const passwordHash = crypto.scryptSync(password, 
                                          Buffer.from(kdfParams.salt, 'hex'),
                                          kdfParams.dklen,
                                          {
                                            cost: kdfParams.n,
                                            blockSize: kdfParams.r,
                                            parallelization: kdfParams.p,
                                            maxmem: 128 * kdfParams.n * kdfParams.r * 2
                                          })
   const cipher = crypto.createCipheriv(encryptedKeystore.cipherFunction, passwordHash, Buffer.from(encryptedKeystore.iv, 'hex'));
   const encrypted = cipher.update(text);
   const encryptedData = Buffer.concat([encrypted, cipher.final()]);
   encryptedKeystore.message = encryptedData.toString('hex')
   return encryptedKeystore;
}

export function decrypt(encryptedKeystore: EncryptedKeystore, password: string): string {
  //console.log(73, encryptedKeystore)
  const kdfParams = encryptedKeystore.kdfParams;
  const passwordHash = crypto.scryptSync(password, 
                                          Buffer.from(kdfParams.salt, 'hex'),
                                          kdfParams.dklen,
                                          {
                                            cost: kdfParams.n,
                                            blockSize: kdfParams.r,
                                            parallelization: kdfParams.p,
                                            maxmem: 128 * kdfParams.n * kdfParams.r * 2
                                          })
  const encryptedText = Buffer.from(encryptedKeystore.message, 'hex');
  const decipher = crypto.createDecipheriv(encryptedKeystore.cipherFunction, passwordHash, Buffer.from(encryptedKeystore.iv, 'hex'));
  const decryptedText = decipher.update(encryptedText);
  const decrypted = Buffer.concat([decryptedText, decipher.final()]);
  return decrypted.toString('utf8');
}


export async function generateEth2ValidatorKeystore(mnemonic: string, password: string, validatorIndex: number): Promise<string> {
    const path = `m/12381/60/0/0/${validatorIndex.toString()}`;
    //console.log('path', path)
    const masterSecretKey = deriveKeyFromMnemonic(mnemonic);
    //console.log(masterSecretKey)
    const keys = deriveEth2ValidatorKeys(masterSecretKey, validatorIndex);
    //console.log(keys)
    //console.log(bls)
    //console.log(keys0.signing)
    const validator = SecretKey.fromBytes(keys.signing)
    const validatorPubkey = validator.toPublicKey().value.compress()
    //console.log(validator)
    //console.log(Buffer.from(SecretKey.fromBytes(deriveEth2ValidatorKeys(masterSecretKey, 0).signing).toPublicKey().value.compress()).toString('hex'))
    const validatorKeystore = await Keystore.create(password, keys.signing, validatorPubkey, path)
    //console.log(keystore)
    //console.log(keystore.then(value => console.log(J)))
    return JSON.stringify(validatorKeystore)
}