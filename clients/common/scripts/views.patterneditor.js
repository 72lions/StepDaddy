(function() {

  /**
   * The PatternEditor class is responsible for the search UI component
   *
   * @constructor
   * @class PatternEditor
   * @param {Object} id The id of this specific connection.
   */
  mixr.views.PatternEditor = function(item) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    var _self = this;

    var $item = item;
    var $table = $item.find('table');

    var _onToggleNote = function() {

      var isItOn = $(this).toggleClass('active').hasClass('active');
      console.log('You clicked me dude', this, $(this).index(), isItOn ? 1 : 0);
      _self.emit(mixr.enums.Events.NOTE, {volume: isItOn ? 1 : 0, note: $(this).index()});
    };

    /**
     * Adds all the listeners to the elements.
     *
     * @private
     * @function
     */
    var _addEventListeners = function() {
      $table.on('click', 'td', _onToggleNote);
    };


    var _startPlayHead = function () {
      var playheadDuration = 60 / 120 * 4;
      var $playhead = $('#playhead');
      $playhead.css('-webkit-animation-duration', playheadDuration + 's');
    };


    this.addTrack = function (track) {
      console.log('addTrack', track, track.notes.length);

      var $row = $('<tr>');
      for (var i = 0; i < track.notes.length; i++) {
        var $td = $('<td>');
        $row.append($td);
      }
      $table.append($row);
    };

    /**
     * Shows an HTML element
     * @return {mixr.views.PatternEditor} A reference to this instance.
     */
    this.show = function() {
      $item.show();

      _startPlayHead();

      return this;
    }

    /**
     * Initializes the component
     *
     * @private
     * @function
     * @return {mixr.views.PatternEditor} A reference to this instance.
     */
    this.initialize = function() {
      _addEventListeners();
      return this;
    };

  };

}());
