'use strict';


const blessed = require('blessed');
const chalk = require('chalk');
const emoji = _require('library/emoji');

class Screen {

    constructor (whir) {

        this.whir = whir;
        this.screen = blessed.screen({
            smartCSR: true,
            dockBorders: true
        });
        this.screen.title = 'Whir.io';

        this.screen.key('tab', () => {
            this.screen.focusNext();
            this.render();
        });

        this.screen.key(['escape', 'C-c'], () => {
            return process.exit(0);
        });

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
            style: {
                border: {
                    fg: 'white'
                },
                selected: {
                    fg: 'white',
                    bg: 'blue'
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
            fullUnicode: true,
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
            left: '24%+1',
            height: 5,
            top: '100%-5',
            keys: true,
            mouse: true,
            inputOnFocus: true
        });

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

    echo (data, sender = 'whir') {

        data.message = data.message.replace(/_(\w+)_/gi, chalk.green.underline('$1'));
        if (sender !== 'me' && !data.mute) {
            process.stdout.write('\u0007');
        }

        if (this.lastSender !== data.user) {
            this.timeline.pushLine('');
        }

        this.lastUserCount = data.users || this.lastUserCount;
        let line = chalk.green(`${data.user}:`) + ' ' + emoji.process(data.message);
        this.timeline.pushLine(line);
        this.timeline.setScrollPerc(100);
        this.title.setText(`User: ${this.whir.user} | Channel: ${data.channel} | Users: ${this.lastUserCount}`);
        this.render();

        this.lastSender = data.user;
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
            content: data.message + '\n\nPress `esc` to close the application.',
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
}

module.exports = Screen;
