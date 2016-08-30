'use strict';


let config = require('./config'),
    chat = require('./helpers/chat'),
    net = require('net'),
    options = {
        port: config.port,
        host: config.host
    },
    socket = new net.Socket({
        allowHalfOpen: true
    });

process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');
socket.connect(options, () => {
    console.log('Connected to server.');

    let message = '';
    process.stdin.on('data', input => {
        if (input.trim()) {
            message += input;
            socket.write(chat.pack('general', message));
            message = '';
        }
    });
});

socket.on('data', message => {
    process.stdout.write(chat.unpack(message));
});

socket.on('end', () => {
    console.log('Disconnected.');
});
