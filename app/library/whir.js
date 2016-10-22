'use strict';


const co = require('co');
const crypto = require('./crypto');

module.exports = {

    getHeaders: args => {

        const headers = {};

        if (args.file) {
            args = require(args.file);
        }

        for (let arg in args) {
            if (!Array.isArray(args[arg])) {
                headers[`x-whir-${arg}`] = args[arg];
            }
        }

        return co(function* () {
            const randomBytes = yield crypto.bytes(128);
            headers['x-whir-session'] = crypto.hash(randomBytes, 'RSA-SHA256');

            return { headers: headers };
        }).then(headers => Promise.resolve(headers), error => Promise.reject(error));
    }
};
