'use strict';


const chalk = require('chalk');
const background = ['bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite'];
const senders = {};
let lastSender = '';

module.exports = (data, sender, exit) => {

    data.message = data.message.replace(/_(\w+)_/gi, chalk.yellow.bold('$1'));

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
    console.log(chalk[senders[data.user]].bold(' '), chalk.yellow.bold(`${data.user}:`), data.message);
    console.log();
    process.stdout.write('\u001b[2C');

    lastSender = data.user;
    if (exit) {
        process.exit(1);
    }
};
