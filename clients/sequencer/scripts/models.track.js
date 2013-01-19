(function() {

  /**
   * The track model
   *
   * @constructor
   * @class Track
   */
  mixr.models.Track = function() {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    var _id;
    var _name;
    var _notes;
    var _sampleURL;
    var _volume;

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Track} This instance of the model.
     */
    this.initialize = function(sampleURL) {
      this._sampleURL = sampleURL;
      this._notes = [];
      return this;
    };

    this.getNotes = function() {
      return _notes;
    };

  };

}());
