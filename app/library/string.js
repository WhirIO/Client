const emoji = require('../support/emoji.json');

module.exports = {
  emojinize: (input) => input.replace(/:([\w]+):/g, (match, icon) => emoji[icon] || match),

  pad: ({ key, side = 'right', padding = null, char = ' ' }) => {
    if (!key || !padding || key.length >= padding) {
      return key;
    }

    const pad = char.repeat(padding - key.length);
    return side === 'right' ? key + pad : pad + key;
  }
};
