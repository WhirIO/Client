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

        screen.key(['escape', 'C-c'], () => {
            return process.exit(0);
        });

        this.screen.append(this.menu());
        this.screen.append(this.users());
        this.screen.append(this.timeline());
        this.screen.append(this.input());
        this.render();
    }

    menu () {

        const menu = blessed.listbar({
            autoCommandKeys: false,
            keys: true,
            top: '0%',
            left: '0%',
            width: '100%',
            style: {
                bg: 'black',
                item: {
                    bg: 'green',
                    fg: 'black'
                },
                selected: {
                    bg: 'green',
                    fg: 'black'
                }
            }
        });

        menu.addItem({
            text: 'Exit',
            keys: ['q', 'C-c'],
            callback: () => {
                this.screen.destroy();
                process.exit(0);
            }
        });

        return menu;
    }

    users () {

        this.users = blessed.list({
            screen: this.screen,
            top: 1,
            width: '25%',
            keys: true,
            vi: true,
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
            top: 1,
            keys: true,
            left: '25%-1',
            height: '100%-3',
            border: 'line',
            scrollable: true,
            alwaysScroll: true,
            scrollbar: true,
            fullUnicode: true,
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

        this.timeline.on('wheeldown', (offset) => {
            //this.timeline.childOffset = 5;
            //this.screen.render();
        });
        this.timeline.on('wheelup', () => {
            //this.timeline.childOffset = -5;
            //this.screen.render();
        });

        return this.timeline;
    }

    input () {

        this.input = blessed.textbox({
            content: '',
            screen: this.screen,
            border: 'line',
            style: {
                fg: 'default',
                bg: 'default',
                border: {
                    fg: 'white',
                    bg: 'default'
                }
            },
            left: '24%',
            height: 3,
            top: '100%-3',
            keys: true,
            mouse: true,
            inputOnFocus: true
        });

        this.input.on('submit', value => {
            value = value.trim();
            if (!value) {
                return;
            }

            this.input.clearValue();
            this.whir.send(value.trim());
        });

        this.input.on('cancel', () => {
            this.input.clearValue();
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

        let line = chalk.green(`${data.user}:`) + ' ' + emoji.process(data.message).toString('utf-8');
        this.timeline.pushLine(line);
        this.timeline.setScrollPerc(100);
        this.render();

        this.lastSender = data.user;
    }

    render () {
        this.input.focus();
        this.screen.render();
    }
}

module.exports = Screen;