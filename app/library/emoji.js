'use strict';


const emoji = _require('support/emoji.json');

module.exports.process = input => input.replace(/:([\w]+):/g, (match, icon) => `${emoji[icon]} `);
