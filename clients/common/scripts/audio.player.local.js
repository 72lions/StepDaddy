(function() {

  /**
   * The local player class allows to playback audio locally
   *
   * @constructor
   * @class Player
   * @param {mixr.net.connection} connection Connection object.
   */
  mixr.audio.LocalPlayer = function(connection) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    /**
     * Loaded track URL
     *
     * @private
     * @type {String}
     */
    var _audioURL;

    /**
     * AudioContext API
     *
     * @private
     * @type {AudioContext}
     */
    var _audioContext;

    /**
     * Audio source for playback
     *
     * @private
     * @type {SoundSorce}
     */
    var _audioSource;

    /**
     * Audio gain node
     *
     * @private
     * type {GainNode}
     */
    var _gainNode;

    /**
     * Loads the current audio track for playback
     *
     * @private
     * @type {Function}
     * @param {Function} callback Callback when track loaded successfuly.
     * @param {Function} errback Errback with error description.
     */
    var _loadTrack = function(callback, errback) {

      /* Get file with AJAX */
      var request = new XMLHttpRequest();
      request.open('GET', _audioURL, true);
      request.responseType = 'arraybuffer';

      /* Process the track on success */
      request.onload = function() {

        var audioData = request.response;
        var audioBuffer = _audioContext.createBuffer(audioData, true /*make mono*/);

        _audioSource = _audioContext.createBufferSource();
        _audioSource.buffer = audioBuffer;
        _audioSource.connect(_audioContext.destination);
        _audioSource.connect(_gainNode);

        /* Success */
        callback();
      };

      /* Pass the error */
      request.onerror = function() {
        errback(arguments);
      };

      request.send();

    };

    /**
     * Initialize the Player
     *
     * @function
     * @public
     */
    this.initialize = function() {

      if (typeof AudioContext === 'function') {
        _audioContext = new AudioContext();
      }
      else if (typeof webkitAudioContext === 'function') {
        _audioContext = new webkitAudioContext();
      }
      else {
        throw new Error('AudioContext not supported.');
      }

      /* Volume */
      _gainNode = _audioContext.createGainNode();
      _gainNode.gain.value = 0.1;

      return this;
    };

    /**
     * Loads a track specified by the track uri
     *
     * @param {String} uri Track uri.
     * @param {Function} callback Callback when track loaded successfuly.
     * @param {Function} errback Errback with error description.
     */
    this.load = function(uri, callback, errback) {

      if (uri === 'spotify:track:kavinski') {
        _audioURL = 'http://localhost:8282/common/resources/Kavinsky%20-%20Nightcall%20%28Feat.%20Lovefoxxx%29.mp3';
        _loadTrack(callback, errback);
        return;
      }

      connection.resolveURL(uri, function(url) {

        _audioURL = new mixr.net.ProxyRequest(url).getCDNUrl();
        _loadTrack(callback, errback);

      }, errback);

    };

    /**
     * Playbacks the track
     *
     * @param {Function} callback Callback when track loaded successfuly.
     * @param {Function} errback Errback with error description.
     */
    this.play = function(callback, errback) {

      if (!_audioSource) {
        errback('Audio not loaded');
      }
      else {
        _audioSource.noteOn(0);
      }

    };

  };

})();
