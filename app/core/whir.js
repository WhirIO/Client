'use strict';


const co = require('co');
const WS = require('ws');
const crypto = _require('library/crypto');
const EventEmitter = require('events').EventEmitter;

class Whir extends EventEmitter {

    constructor (argv = {}) {

        super();
        this.conversation = [];
        this.conversationIndex = 0;
        this.host = argv.host || 'chat.whir.io';
        this.getHeaders(argv)
            .then(headers => {
                this.user = argv.user;
                this.mute = argv.mute || false;
                this.socket = new WS(`ws://${this.host}`, headers);
                this.socket
                    .on('open', () => {})
                    .on('message', data => {
                        data = JSON.parse(data.toString('utf8'));
                        this.channel = data.channel || argv.channel;
                        data.mute = this.mute;
                        this.appendConversation(data);
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
        if (data.message.match(/^\/[\w]/)) {
            data.command = data.message.replace(/^\//g, '');
        }

        this.appendConversation(data);
        this.emit('sent', data);
    }

    getHeaders (argv) {
        if (argv.file) {
            argv = require(argv.file);
        }

        const headers = {};
        const connParams = ['channel', 'user', 'max', 'timeout'];
        for (let arg in argv) {
            if (argv[arg] && connParams.indexOf(arg) >= 0) {
                headers[`x-whir-${arg}`] = argv[arg];
            }
        }

        return co(function* () {
            const randomBytes = yield crypto.bytes(128);
            headers['x-whir-session'] = crypto.hash(randomBytes, 'RSA-SHA256');

            return { headers: headers };
        }).then(headers => Promise.resolve(headers), error => Promise.reject(error));
    }

    appendConversation (data) {

        this.conversation.push({
            user: data.user,
            message: data.message,
            timestamp: (new Date()).getTime()
        });
    }
}

module.exports = Whir;
