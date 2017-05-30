#!/usr/bin/env node

const path = require('path');
const Whir = require('./core/whir');
const yargs = require('yargs');

const expect = {
  user: { alias: 'u', describe: 'Username.', demand: true },
  pass: { alias: 'p', describe: 'Password.', default: null },
  channel: { alias: 'c', describe: 'Channel.', default: null },
  host: { alias: 'h', describe: 'Whir.io server.', default: 'chat.whir.io' },
  mute: { alias: 'm', describe: 'Mute the conversation.' },
  store: { alias: 's', describe: 'Where to store application data.', default: path.normalize(`${__dirname}/../store`) },
  scrollSize: { alias: 'ss', describe: 'Lines to keep in scroll history.', default: 100 }
};
const argv = yargs.options(expect)
  .usage('\nUsage: whir.io --user=[user]')
  .example('whir.io --user=stefan')
  .example('whir.io -u stefan -c friends')
  .epilogue('For more information, visit https://whir.io')
  .argv;
const whir = new Whir(argv, process.env.UNSECURE_SOCKET === 'true');

/**
 * Emitting events makes the architecture more plug-able.
 * It's easy to implement custom logic -or extended the existing one-
 * for each emitted event.
 */
whir.on('sent', data => whir.screen.print(data, { sender: 'me' }))
  .on('received', data => whir.screen.print(data))
  .on('alert', data => whir.error(data))
  .on('close', data => whir.error(data))
  .on('error', data => whir.error(data));
