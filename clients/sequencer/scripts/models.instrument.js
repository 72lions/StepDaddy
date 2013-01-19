(function() {

  /**
   * The instrument model
   *
   * @constructor
   * @class Intrument
   */
  mixr.models.Intrument = function() {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    var _id;
    var _name;
    var _trackIds;
    var _volume;

    /**
     * Initializes the model
     *
     * @public
     * @function
     * @return {mixr.controllers.Intrument} This instance of the model.
     */
    this.initialize = function() {
      return this;
    };

  };

}());
