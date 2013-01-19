(function() {

  /**
   * The track model
   *
   * @constructor
   * @class Track
   */
  mixr.models.Track = function(id, name, notes, sampleUrl, volume) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    this.id = id || '';
    this.name = name || '';
    this.notes = notes || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.sampleUrl = sampleUrl || '';
    this.volume = volume || 1;

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

    this.getNotes = function() {
      return _notes;
    };

    this.loadSample = function(callback) {

      var request = new XMLHttpRequest();
      request.open("GET", this.sampleUrl, true);
      request.responseType = "arraybuffer";

      request.onload = function() {
          var buffer = context.createBuffer(request.response, false);
          callback(buffer);
          console.log('sample loaded', buffer);
      }

      request.send();
    };

}());
