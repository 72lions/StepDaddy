define(['sys', 'events'], function(sys, events) {

  /**
   * The Player class is an interface for playing music.
   *
   * @constructor
   * @class Player
   */
  var Wrapper = function() {};

  sys.inherits(Wrapper, events.EventEmitter);

  return Wrapper;

});
