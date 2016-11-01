'use strict';


const co = require('co');
const fs = require('fs');
const WS = require('ws');
const path = require('path');
const crypto = _require('library/crypto');
const Screen = require('./screen');
const EventEmitter = require('events').EventEmitter;

class Whir extends EventEmitter {

    constructor (argv = {}) {

        super();
        this.history = [];
        this.historyIndex = 0;
        this.historyLoaded = false;
        this.historyPath = path.normalize(`${__dirname}/../../history`);
        this.host = argv.host || 'chat.whir.io';
        this.user = argv.user;
        this.muteChannel = argv.mute || false;
        this.getHeaders(argv)
            .then(headers => {
                this.headers = headers;
                this.connect();
            })
            .catch(data => this.emit('error', data));
    }

    connect () {

        this.socket = new WS(`wss://${this.host}`, this.headers);
        this.socket
            .on('open', () => {
                this.screen = new Screen(this);
                this.screen.muteChannel = this.muteChannel;
            })
            .on('message', data => {
                data = JSON.parse(data.toString('utf8'));
                this.channel = data.channel || argv.channel;

                const whir = this;
                co(function *() {
                    if (!whir.historyLoaded) {
                        yield whir.loadHistory();
                        whir.emit('history');
                    }

                    whir.appendHistory(data);
                    whir.emit('received', data);
                });
            })
            .on('close', (code, data) => this.emit('close', data));
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
            switch (data.command) {
                case 'exit': return this.screen.destroy();
                case 'clear':
                    this.screen.timeline.getLines().forEach((lines, index) => {
                        this.screen.timeline.deleteLine(index);
                    });
                    break;
                case 'mute': this.screen.muteChannel = true;
                    break;
                case 'unmute': this.screen.muteChannel = false;
                    break;
            }
        }

        this.historyIndex = 0;
        this.appendHistory(data);
        this.emit('sent', data);
    }

    getHeaders (argv) {

        return co(function* () {

            const fields = ['channel', 'user', 'pass'];
            const headers = {
                'x-whir-session': crypto.hash(yield crypto.bytes(128), 'RSA-SHA256')
            };

            fields.forEach(field => {
                if (argv[field]) {
                    headers[`x-whir-${field}`] = argv[field];
                }
            });

            return { headers: headers };
        }).then(headers => Promise.resolve(headers), error => Promise.reject(error));
    }

    appendHistory (data) {

        if (data.command || !data.user) {
            return;
        }

        this.history.push({
            user: data.user,
            message: data.message,
            timestamp: (new Date()).getTime()
        });
    }

    loadHistory () {

        return new Promise(yes => {
            fs.readFile(`${this.historyPath}/${this.user}.${this.channel}.json`, (error, history) => {
                if (!error) {
                    this.history = JSON.parse(history);
                }

                this.historyLoaded = true;
                yes(this.history.length > 0);
            });
        });
    }

    saveHistory () {

        return new Promise(yes => {
            fs.writeFile(`${this.historyPath}/${this.user}.${this.channel}.json`, JSON.stringify(this.history), error => {
                if (error) {
                    return this.emit('error', 'Your conversation could not be saved.');
                }

                yes();
            });
        });
    }
}

module.exports = Whir;
