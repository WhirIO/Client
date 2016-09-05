'use strict';


let EventEmitter = require('events').EventEmitter,
    messageHelper = require('./../library/message'),
    parse = require('./../library/parse'),
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

        parse.input()
            .then(result => {

                let url = this.host + (this.port ? `:${this.port}` : '');
                this.socket = new WebSocket(`ws://${url}`, { headers: result.headers });
                this.socket
                    .on('open', () => {
                        process.stdout.write('\x1Bc');
                    })
                    .on('message', data => {
                        data = messageHelper.unpack(data);
                        this.channel = this.channel || data.channel;
                        this.username = this.username || data.username;
                        this.emit('message', data);
                    })
                    .on('close', (code, data) => {
                        this.emit('close', { sender: '@whir', message: data });
                    });
            })
            .catch(error => this.emit('error', error));
    }

    sendMessage (sender, message) {

        let data = {
            sender: sender,
            channel: this.channel,
            message: message
        };

        this.socket.send(messageHelper.pack(data), { binary: true, mask: true });
        data.sender = 'Me';
        this.emit('sent', data);
    }

    eventHandler (input) {

        input = input.trim();
        if (input) {
            this.sendMessage(this.username, input);
        }
    }
}

module.exports = Whir;
