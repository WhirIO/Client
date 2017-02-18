const emoji = require('../support/emoji.json');

module.exports = {

  emojinize: input => input.replace(/:([\w]+):/g, (match, icon) => emoji[icon] || match),

  pad: (string, side = 'right', padding = null, char = ' ') => {
    if (!string || !padding || string.length >= padding) {
      return string;
    }

    const pad = char.repeat(padding - string.length);
    return side === 'right' ? string + pad : pad + string;
  }
};
