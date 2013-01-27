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
    var noteCount = 0;

    var $el = $(el);
    var $table = $el.find('table');

    var $playhead = undefined;


    this.drawPlayhead = function(beat) {
      /*
      var labelWidth = $table.find('h1').width();
      var noteWidth = ($(window).width() - labelWidth) / noteCount;

      var offset = labelWidth + noteWidth * (beat);


      if (!$playhead) {
        $playhead = $('#playhead');
        $playhead.css('width', noteWidth);
      }
      $playhead.css('-webkit-transform', 'translate3d(' + offset + 'px, 0, 0)');;
  */
      var $tds = $('th:nth-child(' + (beat + 2) + ')');
      $tds.on('webkitAnimationEnd', function() {
        $tds.removeClass('beat');
      });
      $tds.addClass('beat');

    };


    this.addInstrument = function(instrument) {
      for (var i = 0; i < instrument.tracks.length; i++) {
        _addTrack(instrument, instrument.tracks[i]);
      }
    };

    this.updateNote = function(data) {
      $track = $('[data-instrument-id="' + data.id + '"][data-track-id="' + data.trackId + '"]');
      $note = $track.find('td').eq(data.noteId + 1);

      console.log('!updateNote', $note, data);

      $note.toggleClass('active', data.volume > 0);
    };

    var _addTrack = function(instrument, track) {
      console.log('addTrack', track);

      if (trackCount === 0) {
        noteCount = track.notes.length;
        _renderHeader(noteCount);
      }

      var $row = $('<tr>').attr('data-instrument-id', instrument.id)
                          .attr('data-track-id', track.id);

      $row.append($('<td><h1>' + track.name + '</h1></td>'));

      for (var i = 0; i < noteCount; i++) {
        var $td = $('<td>');
        $row.append($td);
      }

      $row.css('background', instrument.color);
      $table.append($row);
      trackCount++;
    };

    var _renderHeader = function(length) {
      var $head = $('<thead>');
      for (var i = 0; i < length + 1; i++) {
        var $th = $('<th>');
        $head.append($th);
      }

      //$head.children().eq(0).attr('id', 'playhead');

      $table.append($head);
    };

    /**
     * Shows an HTML element
     * @return {mixr.views.SequencerView} A reference to this instance.
     */
    this.show = function() {
      $el.show();
      return this;
    };

    this.removeInstrument = function(instrument) {
      $table.find('tr[data-instrument-id="' + instrument.id + '"]').remove();
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
