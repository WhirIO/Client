const crypto = require('crypto');

module.exports = {
  bytes: (length, encoding = 'hex') =>
    new Promise((yes, no) => {
      crypto.randomBytes(length, (error, bytes) => {
        if (error || !bytes) {
          return no(new Error('Unable to get random data.'));
        }

        return yes(bytes.toString(encoding));
      });
    }),

  hash: (data, algorithm = 'RSA-SHA512', encoding = 'hex') => {
    const newData = typeof data !== 'string' ? JSON.stringify(data) : data;
    return crypto
      .createHash(algorithm)
      .update(newData, 'utf8')
      .digest(encoding);
  }
};
