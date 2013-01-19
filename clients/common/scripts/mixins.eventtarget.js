(function() {
  /**
   * The EventTarget class is a mixin that will allow to bind to events
   * from that class by using the 'on' keyword.
   *
   * @example
   * var l = new SomeClass();
   * l.on('something', someFunction);
   *
   * @constructor
   * @class EventTarget
   */
  mixr.mixins.EventTarget = function() {

    /**
     * Holds all the callbacks for all the events.
     *
     * @private
     * @type {Object}
     */
    this._events = {};

    /**
     * Registers an event to a callback
     *
     * @public
     * @function
     * @param {Strgin} event The event name.
     * @param {Function} callback The callback to be register.
     */
    this.on = function(event, callback) {
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].push(callback);

      return this;
    };

    /**
     * Emits a specific event by executing the callback functions associated
     * with this event
     *
     * @private
     * @function
     * @param {String} event The event type.
     * @param {Object} data The data to send to the callback.
     */
    this.emit = function(event, data) {
      if (this._events[event]) {
        var events = this._events[event];
        for (var i = 0; i < events.length; i++) {
          events[i](data);
        }
      }
    };

  };

}());
