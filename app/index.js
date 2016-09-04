'use strict';


let config = require('./config'),
    Whir = require('./core/whir'),
    whir = new Whir({
        host: config.host,
        port: config.port
    });

whir.on('sent', text => {
        // Nicely render the message
        console.log(text);
    })
    .on('message', text => {
        // Nicely render the message
        console.log(text);
    })
    .on('close', text => {
        // Nicely render the message
        console.log(text);
        process.exit(1);
    })
    .on('error', text => {
        console.error(text);
        process.exit(1);
    });;
