define(['sys', 'mixins.wrapper'], function(sys, MixinsWrapper) {
  /**
   * A client is a wrapper for a socket. When a client connects to the server
   * then an instance of this class is created
   *
   * @constructor
   * @class Client
   * @param {String} id The id of the client.
   * @param {Object} socket The socket.
   */
  var Client = function(id, socket) {

    /**
     * Is set to true if the client is connected
     *
     * @type {Boolean}
     */
    this.isConnected = true;

    /**
     * The id of this client
     *
     * @type {String}
     */
    this.id = id || '';

    /**
     * Holds a reference to this instance.
     *
     * @private
     * @type {[type]}
     */
    var _self = this;

    /**
     * The socket for this client
     *
     * @private
     * @type {Object}
     */
    var _socket = {id: ''};

    /**
     * Is triggered when the execute message is send
     * from the client.
     *
     * @private
     * @function
     * @param {Object} data The data that the client send.
     */
    var _onExecute = function(data) {

      //console.log('Client wants me to execute', data.call, 'with these arguments', data.args);

      _self.emit(data.call, data);

    };

    /**
     * Registers the event listeners for this socket
     *
     * @private
     * @function
     */
    var _addEventListeners = function() {

      _socket.on('emit', function(data) {
        _self.emit('emit', data);
      });

      _socket.on('byebye', function(data) {
        _self.emit('byebye', {client: _self.id});
        _socket.disconnect();
      });

      _socket.on('disconnect', function() {
        this.isConnected = false;
        _self.emit('disconnect', {client: _self.id});
      });

      _socket.on('execute', _onExecute);

    };

    /**
     * Sets the socket for this client
     *
     * @public
     * @function
     * @param {Object} socket The socket.
     * @return {Client} This client.
     */
    this.setSocket = function(socket) {
      console.log('Set socket for client with id', this.id);
      this.isConnected = true;
      _socket = socket;

      _addEventListeners();

      return this;
    };

    /**
     * Sends a message to the server
     *
     * @public
     * @function
     * @param  {String} messageType The type of the message.
     * @param  {String|Object|Number|Boolean|Array} message The message data to send to the server.
     * @return {Client} Returns this instance.
     */
    this.send = function(messageType, message) {
      if (typeof message === 'undefined') {
        message = {};
      }
      //console.log('[Talking to the client] -> ', messageType, '| Data:', message);
      _socket.emit(messageType, message);

      return this;
    };

    // Set the socket upon initialization
    this.setSocket(socket);

  };

  sys.inherits(Client, MixinsWrapper);

  return Client;

});
