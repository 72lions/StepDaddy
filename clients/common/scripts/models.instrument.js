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
    this.available = true;
    this.numTracksLoaded = 0;

    var _self = this;

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

    this.loadTracks = function(context) {
      for (var i = 0; i < tracks.length; i++) {
        tracks[i].loadSample(this.trackLoaded, context);
      };
    };

    this.trackLoaded = function(track) {
      _self.numTracksLoaded++;
      if (_self.numTracksLoaded == _self.tracks.length) {
        console.log('All samples loaded.');
      }
    }

    // track.getBuffer();


  };

}());
