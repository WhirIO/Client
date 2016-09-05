'use strict';


let render = require('./library/render'),
    Whir = require('./core/whir'),
    whir = new Whir({
        host: 'chat.whir.io'
    });

whir.on('sent', text => render('left', text))
    .on('message', text => render('right', text))
    .on('close', text => render('center', text, true))
    .on('error', text => render('center', text, true));
