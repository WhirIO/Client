'use strict';


const co = require('co');
const crypto = require('./crypto');

module.exports = {

    getHeaders: argv => {
        if (argv.file) {
            argv = require(argv.file);
        }

        const headers = {};
        const connParams = ['channel', 'user', 'max', 'timeout'];
        for (let arg in argv) {
            if (argv[arg] && connParams.indexOf(arg) >= 0) {
                headers[`x-whir-${arg}`] = argv[arg];
            }
        }

        return co(function* () {
            const randomBytes = yield crypto.bytes(128);
            headers['x-whir-session'] = crypto.hash(randomBytes, 'RSA-SHA256');

            return { headers: headers };
        }).then(headers => Promise.resolve(headers), error => Promise.reject(error));
    }
};
