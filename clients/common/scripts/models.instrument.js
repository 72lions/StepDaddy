(function() {

  /**
   * The instrument model
   *
   * @constructor
   * @class Instrument
   */
  mixr.models.Instrument = function(id, name, tracks, volume, type, color) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    this.id = id.toString() || '';
    this.name = name || '';
    this.tracks = tracks || [];
    this.volume = volume || 0;
    this.type = type || 'samples';
    this.color = color || '#888';

    this.available = true;
    this.numTracksLoaded = 0;

    var _self = this;
    var _readyCallback = null;
    var _isLoaded = false;

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Intrument} This instance of the model.
     */
    this.initialize = function(readyCallback) {
      _readyCallback = readyCallback;
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
        _readyCallback();
        _isLoaded = true;
      }
    };

    this.isLoaded = function() {
      return _isLoaded;
    };

  };

}());
