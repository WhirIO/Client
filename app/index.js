'use strict';


let config = require('./config'),
    Whir = require('./core/whir'),
    whir = new Whir({
        host: config.host,
        port: config.port
    });

whir.on('sent', text => {
        // Nicely render the message
        process.stdout.write(text);
    })
    .on('received', text => {
        // Nicely render the message
        process.stdout.write(text);
    });
