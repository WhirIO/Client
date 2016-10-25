'use strict';


const WS = require('ws');
const EventEmitter = require('events').EventEmitter;
const helper = _require('library/whir');

class Whir extends EventEmitter {

    constructor (argv = {}) {

        super();
        this.conversation = [];
        this.conversationIndex = 0;
        this.host = argv.host || 'chat.whir.io';
        helper.getHeaders(argv)
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

    appendConversation (data) {

        this.conversation.push({
            user: data.user,
            message: data.message,
            timestamp: (new Date()).getTime()
        });
    }
}

module.exports = Whir;
