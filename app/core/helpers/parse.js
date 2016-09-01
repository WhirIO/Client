'use strict';


let querystring = require('querystring');

module.exports = {

    args: () => {

        let args = {};
        process.argv.slice(2).map(arg => {
            if (arg.indexOf(':') >= 0) {
                arg = arg.split(':');
                switch (arg[0]) {
                    case 'u':
                    case 'username': args.username = arg[1];
                        break;
                    case 'c':
                    case 'channel': args.channel = arg[1];
                        break;
                    case 'm':
                    case 'max': args.max = arg[1];
                        break;
                    case 't':
                    case 'timeout': args.timeout = arg[1];
                        break;
                    case 'f':
                    case 'file': args.file = arg[1];
                        break;
                }
            }
        });

        return {
            object: args,
            string: querystring.stringify(args)
        };
    }
};
