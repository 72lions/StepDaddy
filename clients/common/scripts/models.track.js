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
    this.notes = notes || [];
    this.sampleUrl = sampleUrl || '';
    this.volume = volume || 1;

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Track} This instance of the model.
     */
    this.initialize = function() {
      return this;
    };

    this.setNoteVolume = function(index, volume) {
      this.notes[index] = volume;
    };

    this.getNotes = function() {
      return _notes;
    };

  };

}());
