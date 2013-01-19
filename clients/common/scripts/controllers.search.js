(function() {

  /**
   * The Search controller is responsible for handling all the commands
   *
   * @constructor
   * @class Search
   */
  mixr.controllers.Search = function(model) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    /**
     * An array holding all the search ui elements.
     *
     * @private
     * @type {Array.<mixr.views.Search>}
     */
    var _searchViews = [];

    /**
     * The model for this controller
     *
     * @private
     * @type {mixr.models.Search}
     */
    var _model = model || {};

    /**
     * Is triggered when the search view triggers the SEARCH event
     *
     * @private
     * @function
     * @param {Object} data The event.
     */
    var _onSearch = function(data) {
      _model.search(data);
    };

    /**
     * Initializes the controller
     *
     * @public
     * @function
     * @return {mixr.controllers.Search} This instance of the controller.
     */
    this.initialize = function() {

      // Create the views by finding all the items in the page
      var items = document.querySelectorAll('.search-box');

      // Loop and create the Search class for each item
      for (var i = 0, len = items.length; i < len; i += 1) {

        var search = new mixr.views.Search(items[i])
        .initialize()
        .on(mixr.enums.Events.SEARCH, _onSearch);

        _searchViews.push(search);
      }

      return this;
    };

  };

}());
