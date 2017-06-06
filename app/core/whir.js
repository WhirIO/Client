const crypto = require('../library/crypto');
const Emitter = require('events').EventEmitter;
const fs = require('fs');
const lineReader = require('readline');
const Screen = require('./screen');
const Spinner = require('cli-spinner').Spinner;
const WS = require('ws');

const getHeaders = async ({ user, channel, pass, store }) => {
  const headers = data => ({
    headers: {
      'x-whir-session': data.session,
      'x-whir-channel': channel || '',
      'x-whir-user': user,
      'x-whir-pass': pass || ''
    }
  });

  try {
    const data = fs.readFileSync(`${store}/${user}.whir`, 'utf8');
    return headers(JSON.parse(data));
  } catch (error) {
    const session = crypto.hash(await crypto.bytes(128), 'RSA-SHA256');
    try {
      fs.appendFileSync(`${store}/${user}.whir`, JSON.stringify({ session }), { flag: 'a' });
      return headers({ session });
    } catch (writeError) {
      return { error: writeError };
    }
  }
};

class Whir extends Emitter {

  constructor(argv = {}, unsecure = false) {
    super();

    this.host = argv.host;
    this.user = argv.user;
    this.channel = argv.channel;
    this.scrollSize = argv.scroll;
    this.store = argv.store;
    this.muteChannel = argv.mute || false;

    this.protocol = `ws${unsecure ? '' : 's'}`;
    getHeaders(argv)
    .then((headers) => {
      if (headers.error) {
        throw headers.error;
      }

      console.log();
      this.spinner = new Spinner(' %s Connecting...');
      this.spinner.setSpinnerString(18);
      this.spinner.start();
      return this.connect(headers);
    })
    .catch(error => this.emit('error', error));
  }

  connect(headers) {
    try {
      this.socket = new WS(`${this.protocol}://${this.host}`, headers);
    } catch (error) {
      return this.emit('error', error);
    }

    setInterval(() => {
      if (!this.socket.whirAlive) {
        return this.socket.terminate();
      }

      this.socket.whirAlive = false;
      return this.socket.ping('', true, true);
    }, 40000);

    return this.socket
      .on('open', async () => {
        this.socket.whirAlive = true;
      })
      .on('message', this.messageHandler.bind(this))
      .on('error', (error) => {
        this.spinner.stop(true);
        this.emit('error', error);
      })
      .on('close', (code, data) => {
        this.spinner.stop(true);
        this.emit('close', data);
      })
      .on('pong', function pong() {
        this.whirAlive = true;
      });
  }

  async messageHandler(data) {
    try {
      if (!this.isLoaded) {
        this.spinner.stop(true);
        this.screen = new Screen(this, { user: this.user, scrollSize: this.scroll, mute: this.muteChannel });
        this.screen.muteChannel = true;

        await this.loadHistory();
        this.screen.muteChannel = this.muteChannel;
        this.isLoaded = true;
      }

      data = JSON.parse(data.toString('utf8'));
      this.channel = data.channel || this.channel;
      data.timestamp = (new Date()).getTime();

      await this.writeHistory(data);
      return this.emit('received', data);
    } catch (error) {
      return this.emit('error', error);
    }
  }

  send(message) {
    const data = {
      user: this.user,
      channel: this.channel,
      message,
      timestamp: (new Date()).getTime()
    };

    let localCommand = false;
    if (data.message.match(/^\/[\w]+/)) {
      data.command = data.message.replace(/^\//g, '');
      switch (data.command) {
        case 'exit': return this.screen.destroy(true);
        case 'clear': localCommand = true;
          this.screen.components.timeline.getLines().forEach((lines, index) => {
            this.screen.components.timeline.deleteLine(index);
          });
          break;
        case 'mute': localCommand = true;
          this.screen.muteChannel = true;
          break;
        case 'unmute': localCommand = true;
          this.screen.muteChannel = false;
          break;
        default:
      }
    }

    if (!localCommand) {
      this.socket.send(JSON.stringify(data), { binary: true, mask: true });
    }

    this.writeHistory(data);
    this.screen.scroll(data);
    return this.emit('sent', data);
  }

  writeHistory(data) {
    return new Promise((yes) => {
      if (!data.user) {
        return yes();
      }

      const file = `${this.store}/${this.user}.${this.channel}.whir`;
      return fs.appendFile(file, `${JSON.stringify(data)}\n`, (error) => {
        if (error) {
          return this.emit('alert', 'Your conversation could not be saved.');
        }

        return yes();
      });
    });
  }

  loadHistory() {
    const history = `${this.store}/${this.user}.${this.channel}.whir`;
    const fileStream = yes => fs.createReadStream(history)
      .on('error', yes.bind(null, 'no_history'))
      .on('end', yes);
    const readLine = (no, line) => {
      try {
        const data = JSON.parse(line);
        data.fromHistory = true;
        this.screen.print(data, { render: false });
        if (data.user === this.user) {
          this.screen.scroll(data);
        }
        return true;
      } catch (error) {
        return no(error);
      }
    };

    return new Promise((yes, no) => {
      lineReader.createInterface({ input: fileStream(yes) })
        .on('line', readLine.bind(null, no));
    });
  }

  error(data) {
    try {
      if (!data) {
        data = {};
      } else {
        data = JSON.parse(data);
      }
    } catch (error) {
      // data is not JSON or is empty
    }

    if (data.code === 'ECONNREFUSED') {
      data.message = ` It was not possible to connect to the server.\n (${data.message})
      \n Make sure your whir.io server is listening.`;
    } else {
      data.message = ` ${data.message || 'The server terminated your connection.'}`;
    }

    if (this.screen) {
      this.screen.destroy();
    }

    console.error(`${data.message}`);
    process.exit(0);
  }
}

module.exports = Whir;
