'use strict';


let EventEmitter = require('events').EventEmitter,
    messageHelper = require('./helpers/message'),
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
                data = messageHelper.unpack(data);
                this.channel = this.channel || data.channel;
                this.username = this.username || data.username;
                this.emit('message', data.message);
            })
            .on('close', (code, data) => {
                this.emit('close', data);
            });
    }

    sendMessage (sender, message) {

        this.socket.send(messageHelper.pack({
            sender: sender,
            channel: this.channel,
            message: message
        }), { binary: true, mask: true });
        this.emit('sent', message);
    }

    eventHandler (input) {

        input = input.trim();
        if (input) {
            this.sendMessage(this.username, input);
        }
    }
}

module.exports = Whir;
