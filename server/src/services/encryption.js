const config = require('config');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const key = config.get('encryptionKey'); // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(value){
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let crypted = cipher.update(value,'utf8','hex')
  crypted += cipher.final('hex');
  return `${iv.toString('hex')}:${crypted.toString()}`;
}
 
function decrypt(value){
  const textParts = value.split(':');

  //extract the IV from the first half of the value
  const IV = Buffer.from(textParts.shift(), 'hex');

  //extract the encrypted text without the IV
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');

  //decipher the string
  var decipher = crypto.createDecipheriv(algorithm, key, IV)
  var decrypted = decipher.update(encryptedText,'hex','utf8')
  decrypted += decipher.final('utf8');
  return decrypted.toString();
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;