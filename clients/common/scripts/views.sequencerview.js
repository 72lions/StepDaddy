(function() {

  /**
   * The SequencerView class is responsible for the search UI component
   *
   * @constructor
   * @class SequencerView
   * @param {Object} id The id of this specific connection.
   */
  mixr.views.SequencerView = function(el) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    var _self = this;

    var trackCount = 0;

    var $el = $(el);
    var $table = $el.find('table');

   
    var _startPlayHead = function () {
      var playheadDuration = 60 / 120 * 4;
      var $playhead = $('#playhead');
      $playhead.css('-webkit-animation-duration', playheadDuration + 's');
    };


    this.addInstrument = function (instrument) {
      for (var i = 0; i < instrument.tracks.length; i++) {
        _addTrack(instrument, instrument.tracks[i]);
      }
    };

    this.updateNote = function (data) {
      $track = $('[data-instrument-id="' + data.id + '"][data-track-id="' + data.trackId + '"]');
      $note = $track.find('td').eq(data.noteId);

      console.log('updateNote', $note);

      $note.toggleClass('active', data.volume > 0);
    };

    var _addTrack = function (instrument, track) {
      console.log('addTrack', track);

      if (trackCount === 0) {
        _renderHeader(track.notes.length);
      }

      var $row = $('<tr>').attr('data-instrument-id', instrument.id)
                          .attr('data-track-id', track.id);

      for (var i = 0; i < track.notes.length; i++) {
        var $td = $('<td>');
        $row.append($td);
      }

      $table.append($row);
      trackCount++;
    };

    var _renderHeader = function (length) {
      var $head = $('<thead>');
      for (var i = 0; i < length; i++) {
        var $th = $('<th>');
        $head.append($th);
      }

      $head.children().eq(0).attr('id', 'playhead');

      $table.append($head);
    };

    /**
     * Shows an HTML element
     * @return {mixr.views.SequencerView} A reference to this instance.
     */
    this.show = function() {
      $el.show();

      //_startPlayHead();
      return this;
    };


    /**
     * Initializes the component
     *
     * @private
     * @function
     * @return {mixr.views.SequencerView} A reference to this instance.
     */
    this.initialize = function() {
      this.show();
      return this;
    };

  };

}());
