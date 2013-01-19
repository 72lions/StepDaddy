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

    var _self = this;

    this.instrument = null;

    /**
     * The connection
     *
     * @private
     * @type {mixr.net.Connection}
     */
    var _connection = connection;

    var _onInstrument = function(data) {
      console.log('Got an instrument', data);
      _self.instrument = new mixr.models.Instrument(data.id, data.name, data.tracks);
      _self.emit(mixr.enums.Events.INSTRUMENT, _self.instrument);
    };

    var _addEventListeners = function() {
      _connection.on(mixr.enums.Events.INSTRUMENT, _onInstrument);
    };

    this.getInstrument = function() {
      _connection.execute(mixr.enums.Events.GET_INSTRUMENT, {});
      return this;
    };

    this.updateNote = function(value) {
      _connection.execute(mixr.enums.Events.NOTE, this.instrument);
    };

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Search} This instance of the controller.
     */
    this.initialize = function() {
      _addEventListeners();
      return this;
    };

  };

}());
