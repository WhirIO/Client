const chalk = require('chalk');
const Components = require('./components');
const moment = require('moment');
const string = require('../library/string');

class Screen {

  constructor(whir, { user = null, scrollSize = 250 }) {
    this.whir = whir;

    this.components = new Components({
      smartCSR: true,
      dockBorders: true,
      fullUnicode: true,
      screenTitle: 'Whir.io'
    });

    this.user = user;
    this.scrollSize = scrollSize;

    this.components.on('message', message => this.whir.send(message));
    this.components.screen.key(['escape'], this.destroy.bind(this, true));
    this.components.screen.append(this.components.title());
    this.components.screen.append(this.components.users());
    this.components.screen.append(this.components.timeline());
    this.components.screen.append(this.components.input());
    this.components.render();
  }

  /**
   * This is the history for the current session only.
   * It is non-atomic and it will be cleared when the application closes.
   * It can be accessed using the arrow keys.
   * @param item
   */
  scroll(item) {
    if (item.user === this.user) {
      if (this.components.scroll.length >= this.scrollSize) {
        this.components.scroll.shift();
      }

      this.components.scroll.push(item);
      this.components.scrollIndex = 0;
    }
  }

  print(data, { sender = 'whir', render = true } = {}) {
    /**
     * Notification sound on incoming messages, when mute = false
     */
    if (sender !== 'me' && !this.muteChannel) {
      process.stdout.write('\u0007');
    }

    /**
     * A blank line between messages from different users.
     * Might be removed if a "floating-box" approach is adopted.
     */
    if (this.lastSender !== data.user && !data.command) {
      this.components.timeline.pushLine('');
    }

    /**
     * Add or remove users from the user panel.
     * Skip this step when loading a user's history.
     * @see this.components.users()
     */
    if (!data.fromHistory) {
      if (data.action === 'join') {
        this.components.users.addItem(data.user);
      } else if (data.action === 'leave') {
        this.components.users.removeItem(data.user);
      }
    }

    /**
     * When establishing a connection, all users are sent back.
     * This takes the data sent by the server and merges it with the
     * existing users, sorts them (alphabetically) and re-populates
     * the users list.
     */
    if (data.currentUsers) {
      data.currentUsers = data.currentUsers
        .concat(this.components.users.children)
        .filter((x, i, a) => a.indexOf(x) === i)
        .sort();

      this.components.users.setItems(data.currentUsers);
    }

    /**
     * Replacements; underline, bold, italics, etc.
     * Find and replace any emoji (as per: http://www.fileformat.info/info/emoji/list.htm)
     * Format the line to be rendered.
     * Render any additional payload sent by the server.
     * Scroll the timeline to the bottom.
     */
    data.message = data.message.replace(/_([\w\s.]+)_/gi, chalk.green.underline('$1'));
    data.message = data.message.replace(/-([\w\s.]+)-/gi, chalk.white('$1'));
    data.message = string.emojinize(data.message);

    if (data.payload && data.payload.showTitle) {
      this.components.timeline.pushLine(data.message);
    } else if (!data.command) {
      data.timestamp = moment(data.timestamp).format('HH:mm');
      data.timestamp = `${chalk.black.bgGreen(data.timestamp)} `;
      const user = data.user ? chalk.green(`${data.timestamp}${data.user}: `) : '';
      if (data.alert) {
        data.message = data.message.split('\n');
        data.message = data.message.map((message) => {
          message = chalk.white.bgRed(message);
          return message;
        });
        data.message = data.message.join('\n');
      }
      this.components.timeline.pushLine(user + data.message);
    }

    /**
     * The response (payload) is flexible in order to accommodate
     * various operations based on whatever the server returns.
     * Currently only the "date" is in use.
     */
    if (data.payload) {
      let padding = null;
      if (typeof data.payload.pad === 'number') {
        padding = data.payload.pad;
      } else if (data.payload.pad) {
        padding = 0;
        Object.entries(data.payload.items).forEach(([key]) => {
          padding = key.length > padding ? key.length : padding;
        });

        const match = data.payload.pad.match(/\+([\d])+/i);
        if (match) {
          padding += parseInt(match[1], 10);
        }
      }

      Object.entries(data.payload.items).forEach(([key, item]) => {
        let passedItem;
        switch (item.type) {
          case 'date':
            passedItem = moment(item.value).fromNow();
            break;
          default:
            passedItem = item.value;
        }

        const line = `\u258B ${string.pad(key, 'right', padding)}${chalk.white(passedItem)}`;
        this.components.timeline.pushLine(line);
      });
    }
    this.components.timeline.setScrollPerc(100);

    /**
     * Keep track of the user who send the last message, just for rendering
     * purposes and update the connected number of users.
     * @see this.components.users
     */
    this.lastSender = data.user;
    const channel = `Channel: ${data.channel}`;
    const user = `User: ${this.whir.user}`;
    const users = `${this.components.users.children.length + 1}`;
    this.components.title.setText(`${this.muteChannel ? '\uD83D\uDD07' : '\uD83D\uDD09'}  ${channel} | ${user} | Users: ${users}`);

    if (render) {
      this.components.render();
    }

    return this;
  }

  destroy(exit = false) {
    this.components.screen.destroy();
    if (exit) {
      console.error(`\n 👋  See you soon, ${this.user}!\n`);
      process.exit(0);
    }
  }
}

module.exports = Screen;
