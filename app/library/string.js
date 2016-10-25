'use strict';


const emoji = _require('support/emoji.json');

module.exports = {

    emojinize: input => input.replace(/:([\w]+):/g, (match, icon) => {
        return emoji[icon] || match;
    }),

    pad: (string, side = 'right', char = ' ', total = 10) => {
        if (!string || string.length >= total) {
            return string;
        }

        const pad = (total - string.length) / char.length;
        for (let i = 0; i < pad; i++) {
            if (side === 'left') {
                string = char + string;
            } else if (side === 'right') {
                string += char;
            }
        }

        return string;
    }
};