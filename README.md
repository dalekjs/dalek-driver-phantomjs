[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

# DalekJS is not maintained any longer :cry:

We recommend [TestCafé](http://devexpress.github.io/testcafe/) for your automated browser testing needs.

---

# dalek-driver-phantomjs - Browser/WebDriver process control

Browser Driver for [PhantomJS](http://phantomjs.org/) using [GhostDriver](https://github.com/detro/ghostdriver) providing an API to control the Browser/WebDriver process.

[![Build Status](https://travis-ci.org/dalekjs/dalek-driver-phantomjs.svg?branch=master)](https://travis-ci.org/dalekjs/dalek-driver-phantomjs)

[![Code Climate](https://codeclimate.com/github/dalekjs/dalek-driver-phantomjs/badges/gpa.svg)](https://codeclimate.com/github/dalekjs/dalek-driver-phantomjs)

[![Coverage Status](https://coveralls.io/repos/dalekjs/dalek-driver-phantomjs/badge.svg?branch=master)](https://coveralls.io/r/dalekjs/dalek-driver-phantomjs?branch=master)

[![Dependency Status](https://david-dm.org/dalekjs/dalek-driver-phantomjs.svg)](https://david-dm.org/dalekjs/dalek-driver-phantomjs)

[![devDependency Status](https://david-dm.org/dalekjs/dalek-driver-phantomjs/dev-status.svg)](https://david-dm.org/dalekjs/dalek-driver-phantomjs#info=devDependencies)

## Browser / Driver Documentation

* [Command Line Interface](http://phantomjs.org/api/command-line.html)
* [WebDriver Capabilities](https://github.com/detro/ghostdriver#what-extra-webdriver-capabilities-ghostdriver-offers)

---

## API Documentation

```js
var Driver = require('dalek-driver-phantomjs');
var driver = new Driver({
  // path to binary
  // default: provided by phantomjs
  "binary": "/path/to/browser-executable",
  // make the WebDriver instance listen on interface 127.0.0.1
  // default: "127.0.0.1"
  "host": "127.0.0.1",
  // make the WebDriver instance listen on a port between 1111 and 2222
  // default: [2048, 4096]
  "portRange": [1111, 2222],
  // CLI parameters passed to PhantomJS at startup
  // default: (--webdriver=<host:port> --ignore-ssl-errors=true)
  "args": [
    // see http://phantomjs.org/api/command-line.html
    "--local-to-remote-url-access=true"
  ],
});

function success(data) {
  console.log("Started browser, WebDriver available at", data.wd);
}

// callback invoked when the process could not be started
function error(err) {
  console.log("Could not start Browser", err);
}

// callback invoked when the process crashed
function failure(err) {
  console.log("Browser crashed!", err);
}

// fire up the browser and WebDriver service
driver.start(success, error, failure);

// gracefully stop the browser
driver.stop(function() {
  console.log('stopped!');
});

// force kill the process (in case stop() doesn't work)
driver.kill();
```

a full integration using [WD.js](https://github.com/admc/wd) could look like

```js
var WD = require('wd');
var Driver = require('dalek-driver-phantomjs');

var wd = wd.promiseChainRemote();
var driver = new Driver({
  name: 'Phantom',
  args: [
    '--local-to-remote-url-access=true'
  ]
});

driver.start(function(options) {
  // initialize WD client from configuration options
  // provided by the browser driver
  wd.remote(options.wd).then(function() {
    // some fun with WebDriver
  });
}, console.log.bind(console));

// stop WD client, then service and browser
wd.quit().then(function() {
  driver.stop();
});
```
