/**
 * The bootstrap
 */
var requirejs = require('requirejs');
var DOMParser = require('xmldom').DOMParser;
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var localStorage = require('localStorage');
var WebSocket = require('ws');
var jsdom = require('jsdom').jsdom;
var doc = jsdom('<html><body><div id="html5audio"></div></body></html>');
var window = doc.createWindow();
var document = doc;

global.localStorage = window.localStorage = localStorage;
global.XMLHttpRequest = window.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = window.WebSocket = WebSocket;
global.DOMParser = window.DOMParser = DOMParser;
global.window = window;
global.document = document;

requirejs.config({
  baseUrl: __dirname + '/scripts'
});

requirejs(['server'], function(Server) {
  var server = new Server();
  server.initialize().start();
});
