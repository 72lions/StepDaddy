(function() {

  /**
   * The PatternEditor model.
   *
   * @constructor
   * @class PatternEditor
   * @param {mixr.net.Connection} connection The connection for doing the call.
   */
  mixr.models.PatternEditor = function(connection) {

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

    this.getInstrument = function() {
      _connection.execute(mixr.enums.Events.GET_INSTRUMENT, {}, function(response) {
        console.log('Success for get instrument', response);
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
      this.getInstrument();
      return this;
    };

  };

}());
