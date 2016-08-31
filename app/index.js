'use strict';


let Whir = require('./helpers/chat'),
    whir = new Whir({
        host: 'localhost',
        port: 9100
    });

whir.on('sent', message => {
    message;
});

whir.on('message', message => {
    process.stdout.write(message);
});
