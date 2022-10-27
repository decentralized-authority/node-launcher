import * as crypto from 'crypto';
const algorithm = 'aes-256-cbc'; //Using AES encryption
//const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


export function hexPrefix(pubkey: string) {
    if (pubkey.startsWith('0x')) {
    return pubkey;
  } else {
    return '0x' + pubkey;
  }
}

export function encrypt(text: string, password: string) {
   //can hash password with sha256, will always create 32 byte hash
   const passwordHash = crypto.createHash('sha256').update(password, 'utf8').digest('base64').slice(0, 32)
   const cipher = crypto.createCipheriv(algorithm, Buffer.from(passwordHash), iv);
   const encrypted = cipher.update(text);
   const encryptedData = Buffer.concat([iv, encrypted, cipher.final()]);
   return encryptedData.toString('base64');
}

export function decrypt(encryptedData: string, password: string) {
  const passwordHash = crypto.createHash('sha256').update(password, 'utf8').digest('base64').slice(0, 32)
  const encryptedDataBuffer = Buffer.from(encryptedData, 'base64')
  const ivBuf = encryptedDataBuffer.slice(0, 16)
  const ciphertext = encryptedDataBuffer.slice(16)
  const iv = Buffer.from(ivBuf.toString('base64'), 'base64');
  const encryptedText = Buffer.from(ciphertext.toString('base64'), 'base64');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(passwordHash), iv);
  const decryptedText = decipher.update(encryptedText);
  const decrypted = Buffer.concat([decryptedText, decipher.final()]);
  return decrypted.toString();
}

