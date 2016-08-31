'use strict';


let chat = require('./helpers/chat'),
    WebSocket = require('ws'),
    socket = new WebSocket('ws://localhost:9100'),
    message = '';

process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');
process.stdin.on('data', input => {
    if (input.trim()) {
        message += input;
        socket.send(chat.pack('general', message));
        message = '';
    }
});

socket.on('message', message => {
    process.stdout.write(chat.unpack(message));
});

socket.on('end', () => {
    console.log('Disconnected.');
});