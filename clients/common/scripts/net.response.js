(function() {

  /**
   * The Search controller is responsible for handling all the commands
   *
   * @constructor
   * @class Search
   * @param {Object} id The id of this specific connection.
   */
  mixr.net.Response = function(data) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    /**
     * The response fromt a call to the server
     *
     * @private
     * @type {Object|Boolean|Number|String}
     */
    this.data = data.response || '';

    /**
     * It is set to true if the call was succesfull
     *
     * @private
     * @type {Boolean}
     */
    this.success = data.success || false;

  };

}());
