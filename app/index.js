#!/usr/bin/env node
'use strict';


global._require = module => require(`${__dirname}/${module}`);
const Whir = _require('core/whir');
const argv = require('yargs')
    .options({
        user: { alias: 'u', describe: 'Username.', demand: true },
        pass: { alias: 'p', describe: 'Password.', default: null },
        channel: { alias: 'c', describe: 'Channel.', default: null },
        host: { alias: 'h', describe: 'Whir.io server.', default: 'chat.whir.io' },
        mute: { alias: 'm', describe: 'Mute the conversation.' }
    })
    .usage('\nUsage: whir.io --user=[user]')
    .example('whir.io --user=stefan')
    .example('whir.io --user=stefan --channel=friends')
    .epilogue('For more information, visit https://whir.io')
    .argv;

const whir = new Whir(argv);

/**
 * Emitting events makes the architecture more plug-able.
 * It's easy to implement custom logic -or extended the existing one-
 * for each emitted event.
 */
whir.on('sent', data => whir.screen.print(data, { sender: 'me' }))
    .on('received', data => whir.screen.print(data))
    .on('close', data => whir.screen.alert(data))
    .on('error', data => whir.screen.alert(data))
    .on('history', () => whir.screen.populateTimeline());
