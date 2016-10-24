'use strict';


const chalk = require('chalk');
const line = () => {
    const screenWidth = process.stdout.columns;
    let box = '';
    for (let col = 0; col < screenWidth; col++) {
        box += '\u2500';
    }

    return box;
};
let lastSender = '';

module.exports = (data, sender, exit) => {

    data.message = data.message.replace(/_(\w+)_/gi, chalk.green.underline('$1'));

    const lines = sender === 'me' ? 2 : 1;
    process.stdout.write(`\u001b[${lines}A`);
    if (sender !== 'me' && !data.mute) {
        process.stdout.write('\u0007');
    }

    process.stdout.write('\u001b[1M');
    if (lastSender !== data.user) {
        process.stdout.write('\u001b[1M');
        console.log();
    }

    process.stdout.write('\u001b[2D');
    console.log(chalk[data.color || 'white']('\u258B'), chalk.green(`${data.user}:`), data.message);
    console.log(line());
    process.stdout.write('\u001b[2C');

    lastSender = data.user;
    if (exit) {
        process.exit(1);
    }
};
