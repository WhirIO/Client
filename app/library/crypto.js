'use strict';


const crypto = require('crypto');

module.exports = {

    bytes: (length, encoding = 'hex') => new Promise((yes, no) => {
        crypto.randomBytes(length, (error, bytes) => {
            if (error || !bytes) {
                return no(null);
            }

            yes(bytes.toString(encoding));
        });
    }),

    hmac: (data, algorithm = 'RSA-SHA512', encoding = 'hex', key) => crypto
        .createHmac(algorithm, key)
        .update(data)
        .digest(encoding),

    hash: (data, algorithm = 'RSA-SHA512', encoding = 'hex') => {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        return crypto.createHash(algorithm).update(data, 'utf8').digest(encoding);
    }
};
