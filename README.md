<p align="center">
	<a href="http://whir.io"><img src="media/whir.png" alt="whir.io" /></a>
</p>

<p>
    <a href="https://asciinema.org/a/4ff69bzz484gopw5hno3ietmm" target="_blank"><img src="https://asciinema.org/a/4ff69bzz484gopw5hno3ietmm.png" /></a>
</p>

```
This is still under development.
It might be unstable until this notice is removed.
```

### Getting started:
```
$> npm install -g whir.io
```

### Options:
- `--user || -u`: Your username for a particular channel. `Required`
- `--pass || -p`: Password, when connecting to private channels.
- `--channel || -c`: The channel to join. Default: `whir generated name`
- `--host || -h`: The server running Whir. Default: `chat.whir.io`
- `--mute || -m`: Mute the conversation. Does not require a value.

### Example uses:
```
$> whir.io --user=stefan --channel=friends
```

or

```
$> whir.io -u=stefan -c=friends
```

or

```
$> whir.io -u=stefan -m
// You will be connected to a randomly named channel.
// The conversation is muted.
```


### License

[MIT](https://github.com/WhirIO/Client/blob/master/LICENSE)

### Enjoy!
