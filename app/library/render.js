'use strict';


const chalk = require('chalk');

module.exports = (data, exit) => {

    data.message = data.message.replace(/_(@?\w+)_/gi, chalk.yellow.bold('$1'));
    data.message = data.message.replace(/(@\w+)/gi, chalk.yellow.underline.bold('$1'));

    if (data.user === 'Me') {
        process.stdout.write('\u001b[1A');
    }

    console.log(` ${chalk.yellow.bold(data.user + ':')} ${data.message}`);

    if (exit) {
        process.exit(0);
    }
};
