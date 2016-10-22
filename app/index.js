#!/usr/bin/env node
'use strict';


global._require = module => require(`${__dirname}/${module}`);
const args = require('minimist')(process.argv.slice(2));
const render = _require('library/render');
const Whir = _require('core/whir');

try {
    const whir = new Whir(args);
    whir.on('sent', text => render(text))
        .on('received', text => render(text))
        .on('close', text => render(text, true))
        .on('error', text => render(text, true));

} catch (error) {
    console.error('\n' + error.message);
    if (args.trace) {
        console.error(error.stack + '\n');
    }

    process.exit(1);
}
