const blessed = require('blessed');
const Emitter = require('events').EventEmitter;

/**
 * Enable scrolling through the conversation with the arrow keys.
 * @see screen.input.key('up', scroll);
 * @see screen.input.key('down', scroll);
 */
const inputHandler = (screen) => {
  const scroll = (char, key) => {
    const condition = () =>
      key.name === 'up' ? screen.scrollIndex < screen.scroll.length : screen.scrollIndex > 1;
    if (screen.scroll.length) {
      let found = false;
      while (!found) {
        if (condition()) {
          found = true;
          screen.scrollIndex += key.name === 'up' ? 1 : -1;
          const data = screen.scroll[screen.scroll.length - screen.scrollIndex];
          screen.input.setValue(data.message);
          return screen.render();
        }
        found = true;
      }
    }
    return true;
  };

  screen.input.key(['up', 'down'], scroll);
  screen.input.key(['C-c'], () => {
    screen.input.clearValue();
    return screen.render();
  });

  screen.input.on('submit', (value) => {
    const submitValue = value.trim();
    if (!submitValue) {
      return screen.render();
    }

    screen.input.clearValue();
    return screen.emit('message', submitValue);
  });
};

class Components extends Emitter {
  constructor(options) {
    super();

    this.screen = blessed.screen(options);
    this.screen.title = options.screenTitle;

    this.scroll = [];
    this.scrollIndex = 0;
  }

  render(status = null) {
    if (status === 'no_history') {
      return;
    }

    if (!this.input.detached) {
      this.input.focus();
    }

    this.screen.render();
  }

  title() {
    this.title = blessed.text({
      screen: this.screen,
      top: 0,
      width: '100%',
      height: 3,
      padding: 1,
      style: {
        bg: 'green',
        fg: 'black'
      }
    });

    this.title.setText(this.screen.title);
    return this.title;
  }

  users() {
    this.users = blessed.list({
      screen: this.screen,
      width: '25%',
      top: 3,
      keys: true,
      border: 'line',
      interactive: false,
      padding: {
        top: 0,
        right: 0,
        bottom: 1,
        left: 1
      },
      style: {
        border: {
          fg: 'white'
        },
        selected: {
          bg: 'green',
          fg: 'black'
        }
      }
    });

    return this.users;
  }

  timeline() {
    this.timeline = blessed.box({
      screen: this.screen,
      mouse: true,
      top: 3,
      left: '25%-1',
      height: '100%-7',
      border: 'line',
      scrollable: true,
      alwaysScroll: true,
      scrollbar: true,
      padding: {
        top: 1,
        right: 0,
        bottom: 1,
        left: 2
      },
      style: {
        border: {
          fg: 'white'
        },
        scrollbar: {
          bg: 'white',
          fg: 'black'
        }
      }
    });

    return this.timeline;
  }

  input() {
    this.input = blessed.textbox({
      screen: this.screen,
      content: '',
      border: 'line',
      padding: {
        top: 1,
        right: 2,
        bottom: 1,
        left: 2
      },
      style: {
        fg: 'default',
        bg: 'default',
        border: {
          fg: 'white',
          bg: 'default'
        }
      },
      left: '25%-1',
      height: 5,
      top: '100%-5',
      keys: true,
      mouse: true,
      inputOnFocus: true
    });

    inputHandler(this);
    return this.input;
  }
}

module.exports = Components;
