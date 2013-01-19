(function() {

  /**
   * Sampler singleton represents the Sampler app
   *
   * @constructor
   */
  mixr.Sampler = function() {

    /**
     * Local player
     *
     * @type {mixr.audio.LocalPlayer}
     */
    var _player;

    /**
     * Connection object
     *
     * @type {mixr.net.Connection}
     */
    var _connection;

    /**
     * Triggered on device registered
     */
    var _onRegistered = function() {

      /* Player object */
      _player = new mixr.audio.LocalPlayer(_connection).initialize();

      /* Load Kavinsky!!! */
      _player.load('spotify:track:kavinski', function() {
        _player.play(function() {}, function() {});
      });

    };

    /**
     * Initialize the Sampler
     */
    this.initialize = function() {

      /* Connect */
      _connection = new mixr.net.Connection('Mixr_Sampler_1');
      _connection.on(mixr.enums.Events.REGISTER, _onRegistered);
      _connection.connect('http://localhost:8181')

    };

  };

  new mixr.Sampler().initialize();

}());
