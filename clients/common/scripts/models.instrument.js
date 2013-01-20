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
    this.color = color || '#C8DEC0';

    this.available = true;
    this.numTracksLoaded = 0;

    var _self = this;
    var _readyCallback = null;
    var _isLoaded = false;
    var _synth = null; 

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

    this.setup = function(context) {
      if (this.type === 'samples') {
        for (var i = 0; i < tracks.length; i++) {
          tracks[i].loadSample(this.trackLoaded, context);
        };
      } else if (this.type === 'synth') {
          console.log('>>> Create synth');
          _synth = new WebSynth(context);
          _synth.filter.set_freq(32); 
          _synth.filter.set_q(4);
          _synth.vco2.set_fine(53.2); 
          _synth.vco2.set_fine(48); 
          _synth.filter.set_amount(30); 
          _synth.eg.set_d(12);
          console.log('Synth ready.');
          _isLoaded = true;
          _readyCallback();
      }
    };

    this.trackLoaded = function(track) {
      _self.numTracksLoaded++;
      if (_self.numTracksLoaded == _self.tracks.length) {
        console.log('All samples loaded.');
        _isLoaded = true;
        _readyCallback();
      }
    };

    this.play = function(note) {
      if (this.type === 'synth' && _synth) {
       // _synth.setVolume(100);
       _synth.play(note);
      }
    };

    this.stop = function() {
      if (this.type === 'synth' && _synth) {
       // _synth.setVolume(0);
       // _synth.stop();
      }
    };

    this.isLoaded = function() {
      return _isLoaded;
    };

  };

}());
