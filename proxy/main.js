var requirejs = require('requirejs');
requirejs.config({
  baseUrl: __dirname + '/scripts'
});

requirejs(['proxy'], function(Proxy) {
  var proxy = new Proxy();
  proxy.initialize().start();
});
