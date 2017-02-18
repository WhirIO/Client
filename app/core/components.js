const blessed = require('blessed');
const Emitter = require('events').EventEmitter;

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

    /**
     * Enable scrolling through the conversation with the arrow keys.
     * @see this.input.key('up', scroll);
     * @see this.input.key('down', scroll);
     */
    const scroll = (char, key) => {
      const condition = () => {
        if (key.name === 'up') {
          return this.scrollIndex < this.scroll.length;
        }

        return this.scrollIndex > 1;
      };

      if (this.scroll.length) {
        let found = false;
        while (!found) {
          if (condition()) {
            found = true;
            this.scrollIndex += key.name === 'up' ? 1 : -1;
            const data = this.scroll[this.scroll.length - this.scrollIndex];
            this.input.setValue(data.message);
            return this.render();
          }
          found = true;
        }
      }

      return true;
    };

    this.input.key(['up', 'down'], scroll);
    this.input.key(['C-c'], () => {
      this.input.clearValue();
      return this.render();
    });

    this.input.on('submit', (value) => {
      value = value.trim();
      if (!value) {
        return this.render();
      }

      this.input.clearValue();
      return this.emit('message', value.trim());
    });

    return this.input;
  }
}

module.exports = Components;
