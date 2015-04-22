module.exports = function DalekBrowserPhantomJSIndex(dalek) {
  'use strict';  

  function PhantomJS(options) {
    this.options = options;

    // (default) config that will be used by the binding
    this._config = {
      host: '127.0.0.1',
      port: [8910, 8910],
      binary: undefined,
      args: undefined
    };

    // check & apply configurtion options
    if (this.options['browser.phantomjs']) {
      var _options = this.options['browser.phantomjs'];
      var _port = Array.isArray(_options.port) ? _options.port : [_options.port, _options.port];
      this._config.port = !!_port[0] ? _port : this._config.port;      
      this._config.binary = _options.path || this._config.binary;
      this._config.host = _options.host || this._config.host;
      this._config.args = Array.isArray(_options.args) ? _options.args : this._config.args;
    }
  };

  // Static property to identify the process
  // TODO: Think about moving static property to some metadata file
  PhantomJS.id = 'phantomjs';

  PhantomJS.prototype.start = function() {
    var deferred = dalek.Q.defer();

    // look for an open port
    this._findSufficientPort(this._config.port[0], this._config.port[1], this._config.host).then(function retrievePort(port) {
      // options that will be exposed
      var options = {port: port, host: this._config.host, id: PhantomJS.id};

      // start the process
      this.process = this._startProcess(options);

      // listen to the process output
      this.process.stdout.on('data', this._watchStartupProcess(deferred, options));
      this.process.stderr.on('data', this._processError(deferred, options));
      this.process.on('close', this._processExit(deferred, options));
    }.bind(this));

    return deferred.promise;
  };

  PhantomJS.prototype.stop = function() {
    this.process.kill('SIGTERM');
    return this;
  };

  PhantomJS.prototype._loadBinary = function(binary) {
    var fs = require('fs');
    var defaultBinary = require('phantomjs2').path;

    // check if a custom binary has been provided
    binary = !!binary ? binary : defaultBinary;

    // check if we need to replace the users home directory
    if (binary !== defaultBinary && process.platform === 'darwin' && binary.trim()[0] === '~') {
      binary = binary.replace('~', process.env.HOME);
    }

    // check if the binary exists
    if (!fs.existsSync(binary)) {
      return false;
    }

    return binary;
  };

  PhantomJS.prototype._findSufficientPort = function(portMin, portMax, address) {
    var deferred = dalek.Q.defer();
    var portscanner = require('portscanner');

    portscanner.findAPortNotInUse(portMin, portMax, address, function checkPorts(err, port) {
      if (err) {
        deferred.reject('No sufficient port available');
        return;
      }

      deferred.resolve(port);
    });

    return deferred.promise;
  },

  PhantomJS.prototype._startProcess = function(options) {
    var phantomjs = this._loadBinary(this._config.binary);
    var spawn = require('child_process').spawn;
    var args = ['--webdriver', options.port, '--ignore-ssl-errors=true'];
    return spawn(phantomjs, dalek._(args).union(this._config.args).unique().value());
  };

  PhantomJS.prototype._watchStartupProcess = function(deferred, options) {
    // timeout (ms) / will reject the promise if not started/failes until then
    var timeout = setTimeout(deferred.reject.bind(deferred, 'Ghost Driver timed out during the startup phase'), 5000);

    // will be called everytime new data comes in from stdout
    return function watchStdout(data) {
      var stream = data + '';

      // check if ghostdriver could be launched
      if (stream.search('GhostDriver - Main - running') !== -1) {
        deferred.resolve(options);
        clearTimeout(timeout);
      } else if (stream.search('Could not start Ghost Driver') !== -1) {
        deferred.reject('Could not start Ghost Driver');
        clearTimeout(timeout);
      }
    };
  };

  PhantomJS.prototype._processError = function(deferred) {
    return function watchStderr(data) {
      var stream = data + '';
      deferred.reject('Unexpected process err: ' + stream);
    };
  };

  PhantomJS.prototype._processExit = function(deferred) {
    return function watchExit(data) {
      var stream = data + '';
      deferred.reject('Process quit unexpectedly: ' + stream);
    };
  };

  return PhantomJS;
};