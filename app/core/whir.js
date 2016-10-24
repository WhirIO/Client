'use strict';


const WS = require('ws');
const EventEmitter = require('events').EventEmitter;
const helper = _require('library/whir');

class Whir extends EventEmitter {

    constructor (args = {}) {

        const host = args.host || 'chat.whir.io';
        if (!args.user) {
            throw new Error('I need, at least, a username to connect with.');
        }

        super();
        process.stdin.setEncoding('utf8');
        process.stdout.setEncoding('utf8');
        process.stdin.on('data', input => {
            input = input.trim();
            if (!input) {
                process.stdout.write('\u001b[1A');
                process.stdout.write('\u001b[2C');
                return;
            }

            this.send(input);
        });

        helper.getHeaders(args)
            .then(headers => {

                this.user = args.user;
                this.mute = args.mute || false;
                this.socket = new WS(`ws://${host}`, headers);
                this.socket
                    .on('open', () => process.stdout.write('\x1Bc'))
                    .on('message', data => {
                        data = JSON.parse(data.toString('utf8'));
                        this.channel = data.channel || args.channel;
                        data.mute = this.mute;
                        this.emit('received', data);
                    })
                    .on('close', (code, data) => this.emit('close', { user: 'whir', message: data }));
            });
    }

    send (message) {

        const data = {
            user: this.user,
            channel: this.channel,
            message: message
        };

        this.socket.send(JSON.stringify(data), { binary: true, mask: true });
        this.emit('sent', data);
    }
}

module.exports = Whir;
