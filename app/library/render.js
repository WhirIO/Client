'use strict';


const chalk = require('chalk');
const background = ['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite'];
const senders = {};
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

    process.stdout.write(`\u001b[${sender==='me'?2:1}A`);
    process.stdout.write('\u001b[1M');

    if (!senders[data.user]) {
        senders[data.user] = background[Math.floor((Math.random() * background.length) + 0)];
    }
    if (lastSender !== data.user) {
        process.stdout.write('\u001b[1M');
        console.log();
    }

    process.stdout.write('\u001b[2D');
    console.log(chalk[senders[data.user]](' '), chalk.green(`${data.user}:`), data.message);
    console.log(line());
    process.stdout.write('\u001b[2C');

    lastSender = data.user;
    if (exit) {
        process.exit(1);
    }
};
