(function() {

  /**
   * The local player class allows to playback audio locally
   *
   * @constructor
   * @class ProxyRequest
   * @param {String} url The url that we need to transform.
   */
  mixr.net.ProxyRequest = function(url) {

    /**
     * The proxy url host for the CDN
     *
     * @private
     * @type {String}
     */
    var CDN_PROXY = 'http://localhost:8080';

    /**
     * The real url of the S3 CDN
     *
     * @private
     * @type {String}
     */
    var AMAZON_PROXY = 'http://dsu0uct5x2puz.cloudfront.net';

    /**
     * Gets a url for the CDN proxy
     *
     * @public
     * @function
     * @return {String} The CDN url via the proxy.
     */
    this.getCDNUrl = function() {
      return url.replace(AMAZON_PROXY, CDN_PROXY);
    };

  };

}());
