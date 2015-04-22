# skaro-browser-phantomjs - Browser/WebDriver process control

> guineapig for skaro browser configuration

Skaro Browser Binding for [PhantomJS 2](http://phantomjs.org/) providing an API to control the Browser/WebDriver process, as well as provide an easy means to install the necessary binaries etc.

See

* [PhantomJS Command Line Interface](http://phantomjs.org/api/command-line.html)

---

Demo `Dalekfile.json` for configuration

```js
{
  // exposing the browser configuration as »phantom«
  "browser.phantom": {
    // »phantom« should use the "skaro-browser-phantomjs" package for process control
    // (required option)
    "interface": "skaro-browser-phantomjs",
    // path to binary
    // default: provided by phantomjs
    "binary": "/path/to/browser-executable",
    // make the WebDriver instance listen on interface 127.0.0.1
    // default: "127.0.0.1"
    "host": "127.0.0.1",
    // make the WebDriver instance listen on port 4020
    // default: 8910
    "port": 4020,
    // CLI parameters passed to PhantomJS at startup
    // default: none
    "args": [
      "--local-to-remote-url-access=true"
    ],
  }
}
```
