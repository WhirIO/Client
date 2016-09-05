'use strict';


let crypto = require('./crypto');

module.exports = {

    input: () => {

        let headers = {},
            settingsFile = null;

        process.argv.slice(2).map(arg => {
            if (arg.indexOf('=') >= 0) {
                arg = arg.split('=');
                switch (arg[0]) {
                    case 'u': case 'username':
                        headers['x-whir-username'] = arg[1];
                        break;
                    case 'c': case 'channel':
                        headers['x-whir-channel'] = arg[1];
                        break;
                    case 'm': case 'max':
                        headers['x-whir-max-users'] = arg[1];
                        break;
                    case 't': case 'timeout':
                        headers['x-whir-timeout'] = arg[1];
                        break;
                    case 'f': case 'file':
                        settingsFile = arg[1];
                        break;
                }
            }
        });

        return new Promise((yes, no) => {

            crypto.bytes(128, bytes => {
                if (!bytes) {
                    return no();
                }

                headers['x-whir-session-id'] = crypto.hash(bytes, 'RSA-SHA256');
                yes({
                    headers: headers,
                    settingsFile: settingsFile
                });
            });
        });
    }
};
