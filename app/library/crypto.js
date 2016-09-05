'use strict';


let crypto = require('crypto');

module.exports = {

    bytes: (length, encoding, callback) => {

        encoding = encoding || 'hex';
        if (typeof encoding === 'function') {
            callback = encoding;
            encoding = 'hex';
        }

        crypto.randomBytes(length, (error, bytes) => {
            if (error) {
                return callback(null);
            }

            callback(bytes.toString(encoding));
        });
    },

    hmac: (data, algorithm, encoding, key) => {

        algorithm = algorithm || 'RSA-SHA512';
        encoding = encoding || 'hex';

        return crypto.createHmac(algorithm, key).update(data).digest(encoding);
    },

    hash: (data, algorithm, encoding) => {

        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }

        algorithm = algorithm || 'RSA-SHA512';
        encoding = encoding || 'hex';

        return crypto.createHash(algorithm).update(data, 'utf8').digest(encoding);
    }

};
