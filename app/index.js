#!/usr/bin/env node
'use strict';


global._require = module => require(`${__dirname}/${module}`);
const args = require('minimist')(process.argv.slice(2));
const Whir = _require('core/whir');
const Screen = _require('core/screen');

try {
    const whir = new Whir(args);
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
