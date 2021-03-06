(function() {

  /**
   * The track model
   *
   * @constructor
   * @class Track
   */
  mixr.models.Track = function(id, name, notes, sampleUrl, volume) {

    var _buffer = null;
    var _self = this;

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    this.id = id || '';
    this.name = name || '';
    this.notes = notes || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.sampleUrl = sampleUrl || '';
    this.volume = volume || 1;

    this.note = null;

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Track} This instance of the model.
     */
    this.initialize = function(sampleUrl) {
      this.sampleUrl = sampleUrl;
      this.notes = [];
      return this;
    };

    this.loadSample = function(callback, context) {
      var request = new XMLHttpRequest();
      request.open("GET", this.sampleUrl, true);
      request.responseType = "arraybuffer";
      var _context = context;

      request.onload = function() {
        _buffer = _context.createBuffer(request.response, false);
        _context.decodeAudioData(request.response, function onSuccess(decodedBuffer) {
          // Decoding was successful, do something useful with the audio buffer
          _buffer = decodedBuffer;
          callback(_self);
        }, function onFailure() {
          console.error("Decoding the audio buffer failed");
        });
      }

      request.send();
    };

    this.resetNotes = function() {
      this.notes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    this.getNotes = function() {
      return _notes;
    };

    this.getBuffer = function() {
      return _buffer;
    };

  };

}());
