[![Dependency status](https://gemnasium.com/badges/github.com/WhirIO/Client.svg)](https://gemnasium.com/github.com/WhirIO/Client)
[![Alpha](https://img.shields.io/badge/status-alpha-8456AC.svg)](https://github.com/WhirIO/Client)

<p align="center">
  <a href="http://whir.io"><img src="media/whir.png" alt="whir.io" width="420" /></a>
</p>


### Installation
```
$> npm i -g whir.io
```


### Options:
- `--user || -u`: Your username (per channel) `Required`
- `--pass || -p`: Password, for private channels.
- `--channel || -c`: Channel you are joining (or creating) `Default: random name`
- `--host || -h`: Whir's host `Default: chat.whir.io`
- `--mute || -m`: Mute the conversation.


### Chat:
```
$> whir.io --user=stefan --channel=friends
```

or

```
$> whir.io -u stefan -c friends
```

or

```
$> whir.io -u stefan -m
// Connected to a random channel.
// The conversation is muted.
```

or

```
$> whir.io -u stefan -c friends -h myawesomedomain.chat
// Running whir on your own server/domain.
```


### Notes
You can also setup and run your own **whir** server.<br />
Here's how to do that: [https://github.com/WhirIO/Server](https://github.com/WhirIO/Server)


### Contribute
```
fork https://github.com/WhirIO/Server
```


### License

[MIT](https://github.com/WhirIO/Client/blob/master/LICENSE)
