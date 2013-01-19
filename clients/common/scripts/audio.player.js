(function() {

  /**
   * The Player class is an interface for playing music.
   *
   * @constructor
   * @class Player
   */
  mixr.audio.Player = function() {

    /**
     * Mixins
     */
    mixr.mixins.EventTarget.call(this);

    /**
     * Is set to true if the player  it is paused.
     *
     * @type {Boolean}
     */
    this.isPaused = false;

    /**
     * Is set to true if the player is playing
     *
     * @type {Boolean}
     */
    this.isPlaying = false;

    /**
     * Is set to true if the player is stopped
     *
     * @type {Boolean}
     */
    this.isStopped = true;

    /**
     * Is initializing the player
     *
     * @public
     * @function
     */
    this.initialize = function() {
      console.log('Initializing the player...');
    };

    /**
     * Starts playing a song in the player
     * @public
     * @function
     */
    this.play = function() {};

    /**
     * Pauses the player
     *
     * @public
     * @function
     */
    this.pause = function() {};

    /**
     * Stops the player
     *
     * @public
     * @function
     */
    this.stop = function() {};

    /**
     * Sets the volume of the player
     *
     * @public
     * @function
     * @param {Number} volume The volume.
     */
    this.setVolume = function(volume) {};

    /**
     * Gets the volume of the player
     *
     * @public
     * @function
     * @return {Number} The volume.
     */
    this.getVolume = function() {
      return 1;
    };

  };

}());
