'use strict';


let EventEmitter = require('events').EventEmitter,
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
        this.channel = 'general';

        this.socket = new WebSocket(`ws://${this.host}:${this.port}`);
        this.socket
            .on('message', message => this.emit('message', this.unpack(message)))
            .on('end', () => this.emit('offline', 'You are disconnected.'));
    }

    pack (sender, message) {

        message = message.trim();

        let channelLength = Buffer.byteLength(this.channel),
            messageLength = Buffer.byteLength(message),
            buffer = new Buffer(channelLength + messageLength + 1);

        buffer.writeUInt8(channelLength, 0);
        buffer.write(this.channel, 1, channelLength);
        buffer.write(message, channelLength + 1, messageLength);

        return buffer;
    }

    unpack (buffer) {

        let channelLength = buffer.readUInt8(0),
            message = buffer.toString('utf8', channelLength + 1);

        return message;
    }

    sendMessage (sender, message) {

        message = this.pack(sender, message);
        this.socket.send(message, { binary: true, mask: true });
        this.emit('sent', message);
    }

    eventHandler (input) {

        input = input.trim();
        if (input) {
            this.sendMessage.bind(this, 'stefan')(input);
        }
    }
}

module.exports = Whir;
