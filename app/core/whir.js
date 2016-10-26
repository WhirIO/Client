'use strict';


const co = require('co');
const fs = require('fs');
const WS = require('ws');
const crypto = _require('library/crypto');
const EventEmitter = require('events').EventEmitter;

class Whir extends EventEmitter {

    constructor (argv = {}) {

        super();
        this.history = [];
        this.historyIndex = 0;
        this.historyLoaded = false;
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

                        if (!this.historyLoaded) {
                            this.loadHistory(data, this.emit.bind(this, 'history'));
                        } else {
                            this.appendHistory(data);
                        }

                        this.emit('received', data);
                    })
                    .on('close', (code, data) => this.emit('close', { user: 'whir', message: data }));
            })
            .catch(error => console.error(error));
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

        this.historyIndex = 0;
        this.appendHistory(data);
        this.emit('sent', data);
    }

    getHeaders (argv) {

        return co(function* () {

            const headers = {
                'x-whir-session': crypto.hash(yield crypto.bytes(128), 'RSA-SHA256')
            };

            if (argv.channel) {
                headers['x-whir-channel'] = argv.channel;
            }

            if (argv.user) {
                headers['x-whir-user'] = argv.user;
            }

            return { headers: headers };
        }).then(headers => Promise.resolve(headers), error => Promise.reject(error));
    }

    appendHistory (data) {

        this.history.push({
            user: data.user,
            message: data.message,
            timestamp: (new Date()).getTime()
        });
    }

    loadHistory (data, callback) {

        fs.readFile(`./history/${this.user}.${this.channel}.json`, (error, history) => {
            if (!error) {
                this.history = JSON.parse(history);
                this.appendHistory(data);
            }

            this.historyLoaded = true;
            callback();
        });
    }

    saveHistory () {

        return new Promise((yes, no) => {
            fs.writeFile(`./history/${this.user}.${this.channel}.json`, JSON.stringify(this.history), error => {
                if (error) {
                    return no('An error has occurred; your conversation could not be saved.');
                }

                return yes();
            });
        });
    }
}

module.exports = Whir;
