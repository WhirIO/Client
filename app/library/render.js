'use strict';


const chalk = require('chalk');
const background = ['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite'];
const senders = {};
let lastSender = '';

module.exports = (data, exit) => {

    data.message = data.message.replace(/_(@?\w+)_/gi, chalk.yellow.bold('$1'));
    data.message = data.message.replace(/(@\w+)/gi, chalk.yellow.underline.bold('$1'));

    if (data.user === 'Me') {
        process.stdout.write('\u001b[2A');
    } else {
        process.stdout.write('\u001b[1A');
    }

    process.stdout.write('\u001b[1M');

    if (!senders[data.user]) {
        senders[data.user] = background[Math.floor((Math.random() * background.length) + 0)];
    }
    if (lastSender !== data.user) {
        process.stdout.write('\u001b[1M');
        console.log();
    }

    const block = chalk[senders[data.user]].bold(' ');
    console.log(block, chalk.yellow.bold(`${data.user}:`), data.message);
    console.log();

    lastSender = data.user;

    if (exit) {
        process.exit(0);
    }
};
