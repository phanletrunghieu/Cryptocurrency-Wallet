const crypto = require('crypto');

const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt text
 * @param text - text to encrypt
 * @param key - key to encrypt. Must be 256 bytes (32 characters)
 */
function encrypt(text, key) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Encrypt text
 * @param text - text to decrypt
 * @param key - key to decrypt. Must be 256 bytes (32 characters)
 */
function decrypt(text, key) {
  let textParts = text.split(':');
  let iv = new Buffer(textParts.shift(), 'hex');
  let encryptedText = new Buffer(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

module.exports = { decrypt, encrypt };
