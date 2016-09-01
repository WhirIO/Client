'use strict';


let EventEmitter = require('events').EventEmitter,
    message = require('./helpers/message'),
    parse = require('./helpers/parse'),
    WebSocket = require('ws');

class Whir extends EventEmitter {

    constructor (options) {
        super();

        process.stdin.setEncoding('utf8');
        process.stdout.setEncoding('utf8');
        process.stdin.on('data', data => this.eventHandler(data));

        options = options || {};
        this.host = options.host;
        this.port = options.port;

        this.socket = new WebSocket(`ws://${this.host}:${this.port}/?${parse.args().string}`);
        this.socket
            .on('open', () => {
                // Do something, if needed.
            })
            .on('message', data => {
                data = message.unpack(data);
                console.log(data);
                this.channel = data.channel;
                this.emit('received', data.message);
            })
            .on('end', () => this.emit('offline', 'You are disconnected.'));
    }

    sendMessage (sender, text) {

        text = message.pack(sender, this.channel, text);
        this.socket.send(text, { binary: true, mask: true });
        this.emit('sent', text);
    }

    eventHandler (input) {

        input = input.trim();
        if (input) {
            this.sendMessage.bind(this, 'stefan')(input);
        }
    }
}

module.exports = Whir;
