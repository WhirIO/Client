<p align="center">
👏🏻 😎 🚀 😻
</p>

<p align="center">
  <a href="http://whir.io"><img src="https://raw.githubusercontent.com/WhirIO/Client/master/media/whir.png" alt="whir.io" width="420" /></a>
</p>
<p>&nbsp;</p>

[![Alpha](https://img.shields.io/badge/Status-ALPHA-8456AC.svg)](https://github.com/WhirIO/Client)
[![ES7](https://img.shields.io/badge/Uses-ES7-00008B.svg)](https://github.com/WhirIO/Client)
[![Downloads](https://img.shields.io/npm/dt/whir.io.svg)](https://www.npmjs.com/package/whir.io)
[![Dependency status](https://gemnasium.com/badges/github.com/WhirIO/Client.svg)](https://gemnasium.com/github.com/WhirIO/Client)

As a developer, I use my command line a lot so why not integrate chat directly into it?<br /> 
**whir** aims to close this gap by providing a simple, flexible, extend-able and blazing fast chat environment, without having to install additional applications.

### Installation
**whir** is written in JavaScript and you should have installed the latest version of Nodejs.
```
$> npm i -g whir.io
```


### Options:
- `--user` || `-u`: Your username (per channel) `Required`
- `--channel` || `-c`: Channel you are joining (or creating) `Default: [random]`
- `--host` || `-h`: Whir's host `Default: chat.whir.io`
- `--pass` || `-p`: Password, for private channels
- `--mute` || `-m`: Mute this conversation


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
// Random channel and muted conversation.
$> whir.io -u stefan -m
```

or

```
// Running whir on your own server/domain.
$> whir.io -u stefan -c friends -h myawesomedomain.chat
```


### Notes
You can also setup and run your own **whir** server.<br />
Here's how to do that: [https://github.com/WhirIO/Server](https://github.com/WhirIO/Server)


### Contribute
```
fork https://github.com/WhirIO/Client
```


### License

[MIT](https://github.com/WhirIO/Client/blob/master/LICENSE)
