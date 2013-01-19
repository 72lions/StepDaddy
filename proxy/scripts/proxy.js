define([
  'http'
], function(http) {

  var Proxy = function() {

    /**
     * The default port
     *
     * @private
     * @type {Number}
     */
    var PORT = 8080;

    /**
     * The http server
     *
     * @private
     * @type {Object}
     */
    var _server;

    /**
     * This specific instance of the proxy class
     *
     * @private
     * @type {Proxy}
     */
    var _self = this;

    /**
     * Is triggered when a new request comes to the proxy
     *
     * @private
     * @function
     * @param {Object} request  The request object.
     * @param {Object} response The response object.
     */
    var _onRequest = function(request, response) {

      var options = {
        host: 'dsu0uct5x2puz.cloudfront.net',
        port: 80,
        path: request.url,
        headers: {
          'user-agent': request.headers['user-agent'],
          'accept-Ranges': 'bytes',
          'connection': 'keep-alive',
          'referer': request.headers['Referer']
        }
      };

      http.get(options, function(res) {
        var headers = res.headers;
        headers['Access-Control-Allow-Origin'] = '*';
        response.writeHead(res.statusCode, headers);
        console.log('Got response', res.statusCode);
        res.on('data', function(chunk) {
          response.write(chunk, 'binary');
        }).on('end', function() {
          response.end();
        });

      }).on('error', function(e) {
        console.log('Got error ' + e.message);
      });

    };

    /**
     * Parses a url and returns an object containing the folowing data (if found): protocol,
     * domain, post, path and path segments, hash and hash segments, query string
     * and an object containing a key/value pair representation of the query
     *
     * @private
     * @param {String} url The url that we need to parse.
     * @return {Object} The object containing the different segments from the parsed URL.
     * @author Justin Windle
     */
    this.parseURL = function(url) {

      url = unescape(url);

      // remove protocol, domain and port
      var cut = url.replace(/^(http(s)?:\/\/)?[^\/]+\/?/i, '');

      // try to match patterns for the data we need
      var parse = {

        protocol: url.match(/^(http(s)?):\/\//i),
        domain: url.match(/^(http(s)?:\/\/)?([^\/:]+)/i),
        query: url.match(/\?([\w\+\-\=&]+)/),
        port: url.match(/\w:(\d{1,5})/),
        hash: url.match(/#([\w\-\/]+)/),
        path: cut.match(/^\/?([\w\-\/\.]+)/)

      };

      // Create a result form any matches returned
      var result = {

        protocol: parse.protocol ? parse.protocol[1] : null,
        domain: parse.domain ? parse.domain[3] : null,
        query: parse.query ? parse.query[1] : null,
        port: parse.port ? parse.port[1] : null,
        hash: parse.hash ? parse.hash[1] : null,
        path: parse.path ? parse.path[1] : null,
        url: url /* return the unescaped url */

      };

      // Split the path into segments
      if (result.path) {
        result.pathSegments = result.path.replace(/^\/|\/$/g, '').split('/');
      }

      // Split the hash into segments
      if (result.hash) {
        result.hashSegments = result.hash.replace(/^\/|\/$/g, '').split('/');
      }

      // Parse the query parameters
      if (result.query) {

        result.params = {};

        var regex = /([\w\+\-]+)\=([\w\+\-]+)/g;
        var param = regex.exec(result.query);

        while (param) {
          result.params[param[1]] = param[2];
          param = regex.exec(result.query);
        }

      }

      return result;
    };

    /**
     * Initializes the proxy
     *
     * @public
     * @function
     * @return {Proxy} This instance of the proxy class.
     */
    this.initialize = function() {
      _server = http.createServer(_onRequest);
      return this;
    };

    /**
     * Opens a connection for the clients to connect to
     * and listen to.
     *
     * @private
     * @function
     * @param {Number} port The port that will be used.
     * @return {Proxy} This instance of the proxy class.
     */
    this.start = function(port) {
      _server.listen(port || PORT);
      console.log('Proxy started');
      return this;
    };

  };

  return Proxy;

});
