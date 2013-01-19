(function() {

  /**
   * The Search class is responsible for the search UI component
   *
   * @constructor
   * @class Search
   * @param {Object} id The id of this specific connection.
   */
  mixr.views.Search = function(item) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    /**
     * The key code for the ENTER key
     *
     * @private
     * @type {Number}
     */
    var KEY_ENTER = 13;

    /**
     * A reference to this instance
     *
     * @private
     * @type {mixr.ui.Search}
     */
    var _self = this;

    /**
     * This object will hold all the references to ui elements.
     *
     * @private
     * @type {Object}
     */
    var _ui = {};

    /**
     * The html element of the search component.
     *
     * @private
     * @type {Object}
     */
    _ui.element = item;

    /**
     * The html element of the search input box.
     *
     * @private
     * @type {Object}
     */
    _ui.search_box = item.querySelectorAll('input.search')[0];

    /**
     * It is triggered every time we press a key.
     *
     * @private
     * @function
     * @param {Object} event The event.
     */
    var _onKeyUp = function(event) {
      if (event.keyCode === KEY_ENTER) {
        if (this.value !== '') {
          _self.emit(mixr.enums.Events.SEARCH, this.value);
        }
      }
    };

    /**
     * Adds all the listeners to the elements.
     *
     * @private
     * @function
     */
    var _addEventListeners = function() {
      _ui.search_box.addEventListener('keyup', _onKeyUp);
    };

    /**
     * Initializes the component
     *
     * @private
     * @function
     * @return {mixr.ui.Search} A reference to this instance.
     */
    this.initialize = function() {
      _addEventListeners();
      return this;
    };

  };

}());
