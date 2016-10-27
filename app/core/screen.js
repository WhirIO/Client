'use strict';


const chalk = require('chalk');
const moment = require('moment');
const string = _require('library/string');
const Components = require('./components');

class Screen extends Components {

    constructor (whir) {

        super({
            smartCSR: true,
            dockBorders: true,
            fullUnicode: true
        });
        this.whir = whir;
        this.screen.title = 'Whir.io';

        this.screen.key(['escape', 'C-c'], this.destroy.bind(this, this));
        this.screen.key('tab', () => {
            this.screen.focusNext();
            this.render();
        });

        this.screen.append(this.title());
        this.screen.append(this.users());
        this.screen.append(this.timeline());
        this.screen.append(this.input());
        this.render();
    }

    populateTimeline () {
        let muteStatus = this.muteChannel;
        this.muteChannel = true;
        this.whir.history.forEach((data, index) => {
            data.channel = this.whir.channel;
            if (index === this.whir.history.length - 1) {
                this.muteChannel = muteStatus;
            }

            this.print(data, data.user, false);
        });
    }

    print (data, sender = 'whir', render = true) {

        /**
         * Notification sound on incoming messages, when mute = false
         */
        if (sender !== 'me' && !this.muteChannel) {
            process.stdout.write('\u0007');
        }

        /**
         * A blank line between messages from different users.
         * Might be removed if a "floating-boxes" approach is adopted.
         */
        if (this.lastSender !== data.user && !data.command) {
            this.timeline.pushLine('');
        }

        /**
         * Add or remove users from the user panel.
         * @see this.users()
         */
        if (data.action) {
            let method = data.action === 'join' ? 'addItem' :
                data.action === 'leave' ? 'removeItem' :
                null;

            if (method) {
                this.users[method](data.user);
            }
        }

        /**
         * When establishing a connection, all users are sent back.
         * This takes the data sent by the server, merges it with the
         * existing users, sorts them (alphabetically) and re-populates
         * the list with the new array of users.
         */
        if (data.currentUsers) {
            data.currentUsers = data.currentUsers
                .concat(this.users.children)
                .filter((x, i, a) => a.indexOf(x) === i)
                .sort();

            this.users.setItems(data.currentUsers);
        }

        /**
         * Replacements; underline, bold, italics, etc.
         * Find and replace any emoji (as per: http://www.fileformat.info/info/emoji/list.htm)
         * Format the line to be rendered.
         * Render any additional payload sent by the server.
         * Scroll the timeline to the bottom.
         */
        data.message = data.message.replace(/_(\w.+)_/gi, chalk.green.underline('$1'));
        data.message = data.message.replace(/-(\w.+)-/gi, chalk.green('$1'));
        data.message = string.emojinize(data.message);
        if (data.payload && data.payload.showTitle) {
            this.timeline.pushLine(data.message);
        } else if (!data.command) {
            let user = data.user ? data.user + ':' : '\u258B';
            this.timeline.pushLine(chalk.green(user) + ' ' + data.message);
        }

        if (data.payload) {
            /**
             * The response is flexible in order to accommodate
             * various operations based on whatever the server returns.
             * Currently only the "date" is in use.
             */
            for (let item in data.payload.items) {
                let passedItem;
                switch (data.payload.items[item].type) {
                    case 'date': passedItem = moment(data.payload.items[item].value).fromNow();
                        break;
                    default: passedItem = data.payload.items[item].value;
                }

                let line = chalk.green(`\u258B ${string.pad(item, 'right', data.payload.pad)} `) + passedItem;
                this.timeline.pushLine(line);
            }
        }
        this.timeline.setScrollPerc(100);

        /**
         * Keep track of the user who send the last message, just for rendering
         * purposes and update the connected number of users.
         * @see this.users
         */
        this.lastSender = data.user;
        this.title.setText(`${this.muteChannel ? '\uD83D\uDD07' : '\uD83D\uDD09'}  Channel: ${data.channel} | User: ${this.whir.user} | Users: ${this.users.children.length + 1}` );

        if (render) {
            this.render();
        }
        return this;
    }

    notify (data) {
        this.screen.append(this.notification(data.message));
        this.input.detach();
        this.users.detach();
        this.timeline.detach();
        this.render();
    }

    render () {

        if (!this.input.detached) {
            this.input.focus();
        }
        this.screen.render();
    }

    destroy () {

        this.whir.saveHistory()
            .then(error => {
                this.screen.destroy();
                if (error) {
                    console.error(`\n > ${error}\n`);
                }
                return process.exit();
            });
    }
}

module.exports = Screen;
