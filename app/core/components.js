'use strict';


const blessed = require('blessed');

class Components {

    constructor (options) {

        this.screen = blessed.screen(options);
        this.screen.title = 'Whir.io';
    }

    title () {

        this.title = blessed.text({
            screen: this.screen,
            top: 0,
            width: '100%',
            height: 3,
            padding: 1,
            style: {
                bg: 'green',
                fg: 'black',
            }
        });

        this.title.setText('whir.io');
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

    notification (text) {

        text = text || 'Your connection was abruptly terminated.';
        text += '\n\n';

        this.notification = blessed.box({
            screen: this.screen,
            top: 'center',
            left: 'center',
            width: '86%',
            height: '20%',
            align: 'center',
            padding: 2,
            style: {
                bg: 'red',
                fg: 'white',
            }
        });

        this.notification.setText(text + 'Press `esc` to close the application.');
        return this.notification;
    }
}

module.exports = Components;
