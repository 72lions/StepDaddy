(function() {
  /**
   * The Utils class.
   *
   * @constructor
   * @class Utils
   */
  mixr.Utils = new function() {

    /**
     * Parses a url and returns an object containing the folowing
     * data (if found): protocol, domain, post, path and path segments,
     * hash and hash segments, query string and an object
     * containing a key/value pair representation of the query
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

  };

}());
