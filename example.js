'use strict';
var wd;

// load the driver
var Driver = require('./index.js');
// initialize the driver
var driver = new Driver({
  host: '127.0.1.1'
});

var stop = function stop() {
  // stop the client
  wd.quit().then(function quitCb() {
    // then stop the driver
    driver.stop(function stopCb() {
      // now we're done
      console.log('bye bye');
    });
  });
};

var success = function success(data) {
  console.log('success', JSON.stringify(data, null, 2));
  return data;
};

var error = function error(data) {
  console.log('error', JSON.stringify(data, null, 2));
};

var haveSomeFunWithWebDriver = function haveSomeFunWithWebDriver() {
  // open a website
  wd.get('https://google.com')
    // find all its links
    .elements('css', 'a').then(success, error)
    // stop WD and the driver
    .then(stop)
    // woopsi
    .catch(function shutdownFailure(errorShutdown) {
      console.error('failure', errorShutdown);
      stop();
    })
    // promises…
    .done();
};

// start the driver
driver.start(
  // callback invoked when driver is started
  function startCb(options) {
    // load, connect and initialize WD.js
    wd = require('wd').promiseChainRemote(options.wd);
    wd.init(options.wd).then(
      haveSomeFunWithWebDriver,
      console.error.bind(console)
    );
  },
  // callback invoked when driver could not start
  console.error.bind(console),
  // callback invoked when driver crashed after successful start
  console.error.bind(console)
);
