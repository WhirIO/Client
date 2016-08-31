'use strict';


let config = require('./config'),
    Whir = require('./core/whir'),
    whir = new Whir({
        host: config.host,
        port: config.port
    });

whir.on('sent', message => {
    // Nicely render the message
    process.stdout.write(message);
});

whir.on('message', message => {
    // Nicely render the message
    process.stdout.write(message);
});
