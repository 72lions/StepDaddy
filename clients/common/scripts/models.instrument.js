(function() {

  /**
   * The instrument model
   *
   * @constructor
   * @class Instrument
   */
  mixr.models.Instrument = function(id, name, tracks, volume) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    this.id = id || '';
    this.name = name || '';
    this.tracks = tracks || [];
    this.volume = volume || 0;

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Intrument} This instance of the model.
     */
    this.initialize = function() {
      return this;
    };

  };

}());
