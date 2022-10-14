import * as crypto from 'crypto';
const algorithm = 'aes-256-cbc'; //Using AES encryption
//const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);



//Encrypting text
export function encrypt(text: string, password: string) {
    //can hash password with sha256, will always create 32 byte hash
    console.log(11);
   const passwordHash = crypto.createHash('sha256').update(password, 'utf8').digest('base64').slice(0, 32)
   console.log(13);
   const cipher = crypto.createCipheriv(algorithm, Buffer.from(passwordHash), iv);
   console.log(15);
   const encrypted = cipher.update(text);
   console.log(17);
   const encryptedData = Buffer.concat([iv, encrypted, cipher.final()]);
   return encryptedData.toString('base64');
}

// Decrypting text
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

