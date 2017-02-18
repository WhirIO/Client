'use strict';



const blessed = require('blessed');
const chalk = require('chalk');
const string = _require('library/string');

class Screen {

    constructor (whir) {

        this.whir = whir;
        this.screen = blessed.screen({
            smartCSR: true,
            dockBorders: true,
            fullUnicode: true
        });
        this.screen.title = 'Whir.io';

        /*
        this.screen.key('tab', () => {
            this.screen.focusNext();
            this.render();
        });
        */

        this.destroy = this.destroy.bind(this, whir);
        this.screen.key(['escape', 'C-c'], this.destroy);

        this.screen.append(this.title());
        this.screen.append(this.users());
        this.screen.append(this.timeline());
        this.screen.append(this.input());
        this.render();
    }

    title () {

        this.title = blessed.text({
            screen: this.screen,
            top: 0,
            width: '100%',
            height: 4,
            padding: {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            },
            style: {
                bg: 'green',
                fg: 'black',
            }
        });

        this.title.setText('Whir.io');
        return this.title;
    }

    users () {

        this.users = blessed.list({
            screen: this.screen,
            width: '25%',
            top: 3,
            keys: true,
            border: 'line',
            interactive: false,
            padding: {
                top: 0,
                right: 0,
                bottom: 1,
                left: 1
            },
            style: {
                border: {
                    fg: 'white'
                },
                selected: {
                    bg: 'green',
                    fg: 'black',
                }
            }
        });

        return this.users;
    }

    timeline () {

        this.timeline = blessed.box({
            screen: this.screen,
            keys: true,
            top: 3,
            left: '25%-1',
            height: '100%-7',
            border: 'line',
            scrollable: true,
            alwaysScroll: true,
            scrollbar: true,
            padding: {
                top: 1,
                right: 0,
                bottom: 1,
                left: 2
            },
            style: {
                border: {
                    fg: 'white'
                },
                scrollbar: {
                    bg: 'white',
                    fg: 'black'
                }
            }
        });

        return this.timeline;
    }

    loadHistory () {
        this.whir.history.forEach(data => {
            data.mute = true;
            data.channel = this.whir.channel;
            this.echo(data, data.user, false);
        });

        this.render();
    }

    input () {

        this.input = blessed.textbox({
            content: '',
            screen: this.screen,
            border: 'line',
            padding: {
                top: 1,
                right: 2,
                bottom: 1,
                left: 2
            },
            style: {
                fg: 'default',
                bg: 'default',
                border: {
                    fg: 'white',
                    bg: 'default'
                }
            },
            left: '25%-1',
            height: 5,
            top: '100%-5',
            keys: true,
            mouse: true,
            inputOnFocus: true
        });

        /**
         * Enable scrolling through the conversation with the arrow keys.
         * @see this.input.key('up', history);
         * @see this.input.key('down', history);
         */
        const history = (char, key) => {

            const condition = () => key.name === 'up' ?
                    this.whir.historyIndex < this.whir.history.length :
                    this.whir.historyIndex > 1;

            if (this.whir.history.length) {
                let found = false;
                while (!found) {
                    if (condition()) {
                        this.whir.historyIndex += key.name === 'up' ? 1 : -1;
                        let data = this.whir.history[this.whir.history.length - this.whir.historyIndex];
                        if (data.user === this.whir.user) {
                            found = true;
                            this.input.setValue(data.message);
                            this.render();
                        }
                        continue;
                    }
                    found = true;
                }
            }
        };

        this.input.key('up', history);
        this.input.key('down', history);

        this.input.on('submit', value => {
            value = value.trim();
            if (!value) {
                return this.render();
            }

            this.input.clearValue();
            this.whir.send(value.trim());
        });

        return this.input;
    }

    echo (data, sender = 'whir', render = true) {

        if (data.command === 'exit') {
            return this.destroy();
        }

        /**
         * Notification sound on incoming messages, when mute = false
         */
        if (sender !== 'me' && !data.mute) {
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
            let method = data.action.method === 'join' ? 'addItem' :
                data.action.method === 'leave' ? 'removeItem' :
                null;

            if (method) {
                this.users[method](data.action.user);
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
         * In case an extra payload was sent by the server, render that as well.
         * Scroll the timeline to the bottom.
         */
        data.message = data.message.replace(/_(\w.+)_/gi, chalk.green.underline('$1'));
        data.message = string.emojinize(data.message);
        if (!data.payload && !data.command) {
            let line = chalk.green(`${data.user}:`) + ' ' + data.message;
            this.timeline.pushLine(line);
        } else if (data.payload) {
            for (let item in data.payload) {
                let line = chalk.green(`/${string.pad(item)}`) + data.payload[item];
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
        this.title.setText(`Channel: ${data.channel} | User: ${this.whir.user} | Users: ${this.users.children.length + 1}`);

        if (render) {
            this.render();
        }
        return this;
    }

    error (data) {

        const error = blessed.box({
            top: 'center',
            left: 'center',
            width: '50%',
            height: '30%',
            padding: {
                top: 2,
                right: 3,
                bottom: 2,
                left: 3
            },
            align: 'center',
            valign: 'middle',
            content: (data.message || data) + '\n\nPress `esc` to close the application.',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'default',
                bg: 'default',
                border: {
                    fg: 'white'
                }
            }
        });

        this.screen.append(error);
        this.render();
    }

    render () {

        this.input.focus();
        this.screen.render();
    }

    destroy (whir) {

        whir.saveHistory()
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
