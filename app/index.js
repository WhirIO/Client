#!/usr/bin/env node
'use strict';


global._require = module => require(`${__dirname}/${module}`);
const Whir = _require('core/whir');
const Screen = _require('core/screen');
const argv = require('yargs')
    .options({
        user: { alias: 'u', describe: 'Username.', demand: true },
        channel: { alias: 'c', describe: 'Channel.', default: null },
        host: { alias: 'h', describe: 'Whir.io server.', default: 'chat.whir.io' },
        max: { alias: 'm', describe: 'Users per channel.', default: 1000 },
        timeout: { alias: 't', describe: 'Disconnect after [timeout].', default: 0 },
        mute: { alias: 'mm', describe: 'Mute the conversation.', default: false }
    })
    .usage('\nUsage: whir.io --user=[user]')
    .example('whir.io --user=stefan')
    .example('whir.io --user=stefan --channel=box')
    .epilogue('For more information, visit https://whir.io')
    .argv;

try {
    const whir = new Whir(argv);
    const screen = new Screen(whir);

    whir.on('sent', data => screen.echo(data, 'me'))
        .on('received', data => screen.echo(data))
        .on('close', data => screen.error(data))
        .on('error', data => screen.error(data));

} catch (error) {
    console.error('\n' + error.message);
    console.error(error.stack + '\n');

    process.exit(1);
}
