'use strict';


let boxen = require('boxen'),
    chalk = require('chalk'),
    messageHelper = require('./message'),
    position = 1,
    lastFloat = 'left';

module.exports = (float, data, exit) => {

    data.message = messageHelper.split(data.message);
    data.message = data.message.replace(/_(\w+)_/gi, chalk.underline.bold('$1'));
    let border = data.sender === '@whir' ? 'double' : 'single',
        message = `${chalk.red(data.sender + ':')}\n${data.message}`,
        box = boxen(message, {
            padding: {
                top: 0,
                right: 1,
                bottom: 0,
                left: 1
            },
            margin: {
                bottom: data.sender === '@whir' ? 1 : 0
            },
            float: data.sender === '@whir' ? 'center' : float,
            borderStyle: border
        });

    if (data.sender !== '@whir') {
        process.stdout.write(`\u001b[${position}A`);
        if (float === 'right') {
            process.stdout.write('\u001b[1B');
            if (lastFloat !== float) {
                process.stdout.write('\u001b[1B');
            }
        }

        position = 2;
    }

    console.log(box);
    lastFloat = float;

    if (exit) {
        process.exit(1);
    }
};
