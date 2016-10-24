<p align="center">
	<a href="http://whir.io"><img src="media/whir.png" alt="whir.io" /></a>
</p>


```
Note: This module is still under development, I am working on it.
It will -most likely- be unstable until I remove this notice.
```

### Getting started:
```
$> npm install -g whir.io
$> whir.io --user=stefan [options]
```


### Options:
- `--host`: The server running Whir. Default: `chat.whir.io`.
- `--user`: Your channel username.
- `--channel`: The channel to join.
- `--max`: Max. users per channel (Only for new channels). Default: `1000`.
- `--timeout`: Disconnect after [timeout] seconds. Default: `0` (no timeout).
- `--file`: Read your settings from file. This overrides the other options.

### Additional flags (these do not require values):

- `--mute`: Mute the conversation, no notification alerts on new messages.
- `--trace`: On errors, print the error stack.


### Example use:
```
$> whir.io --channel=box --user=stefan --mute
```

If you want store your connection parameters in a file instead of passing them as arguments:

```
{
  "user": "stefan",
  "channel": "box",
  "timeout": 10,
  "max": 25
}
```

then

```
$> whir.io --file=[path_to_file]
```

### License

[MIT](https://github.com/WhirIO/Client/blob/master/LICENSE)

### Enjoy!
