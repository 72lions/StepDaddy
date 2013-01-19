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

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Intrument} This instance of the model.
     */
    this.initialize = function(context) {
      this.loadTracks(context);
      return this;
    };

    this.loadTracks = function(context) {
      for (var i = 0; i < tracks.length; i++) {
        tracks[i].loadSample(context, this.trackLoaded);
      };
    };

    this.trackLoaded = function() {
      this.numTracksLoaded++;
      if (this.numTracksLoaded == this.tracks.length) {
        console.log('All samples loaded.');
      }
    }

  };

}());
