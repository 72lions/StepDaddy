(function() {

  /**
   * The search models is responsible for doing search calls
   * through the connection and back to the server.
   *
   * @constructor
   * @class Search
   * @param {mixr.net.Connection} connection The connection for doing the call.
   */
  mixr.models.Search = function(connection) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    /**
     * The connection
     *
     * @private
     * @type {mixr.net.Connection}
     */
    var _connection = connection;

    /**
     * Talks to the server and does a search
     *
     * @public
     * @function
     * @param {String} keyword The keyword to search for.
     * @return {mixr.Models.Search} This instance.
     */
    this.search = function(keyword) {
      _connection.execute(mixr.enums.Events.SEARCH, {keyword: keyword}, function(response) {
        console.log('Success', response);
      }, function(error) {
        console.log('error');
      });
      return this;
    };

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Search} This instance of the controller.
     */
    this.initialize = function() {
      return this;
    };

  };

}());
