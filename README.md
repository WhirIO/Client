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
- `--file`: Your settings file. This will override other options.

If you want store your settings in a file instead of passing arguments:

```
{
  "user": "stefan",
  "channel": "development",
  "timeout": 10,
  "max": 25
}
```

### License

[MIT](https://github.com/WhirIO/Client/blob/master/LICENSE)

### Enjoy!
