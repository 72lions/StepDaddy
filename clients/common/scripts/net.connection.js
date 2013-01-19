(function(io) {

  /**
   * The Connection class is responsible for connecting to the server.
   *
   * @constructor
   * @class Connection
   * @param {String} id The id of this specific connection.
   */
  mixr.net.Connection = function(id) {

    /**
     * Mixins
     */
    mixr.mixins.Wrapper.call(this);

    /**
     * It is true if there is an open connection to the server.
     *
     * @type {Boolean}
     */
    this.isConnected = false;

    /**
     * The instance of this class.
     *
     * @private
     * @type {mixr.net.Connection}
     */
    var _self = this;

    /**
     * The socket instance that will be used
     *
     * @private
     * @type {Object}
     */
    var _socket;

    /**
     * The id of this client
     *
     * @private
     * @type {String}
     */
    var _clientId = id;

    /**
     * The room to where the client is connected
     *
     * @private
     * @type {String}
     */
    var _roomId = null;

    /**
     * Contains a hash map of different calls
     *
     * @private
     * @type {Object}
     */
    var _calls = {};

    /**
     * Is triggered when we are connected to the server
     *
     * @private
     * @function
     */
    var _onConnect = function() {
      _self.isConnected = true;
      console.log('Connected!');
      _self.send(mixr.enums.Events.REGISTER, {client: _clientId});
    };

    /**
     * Is triggered when the client is registered to the server.
     *
     * @private
     * @function
     */
    var _onRegistered = function(data) {
      _self.emit(mixr.enums.Events.REGISTER, data);
    };

    /**
     * Is triggered when we are disconnected from the server
     *
     * @private
     * @function
     */
    var _onDisconnect = function() {
      _self.isConnected = false;
      console.log('Disconnected!');
    };

    /**
     * Is triggered when a room was joined successfully.
     *
     * @private
     * @function
     */
    var _onRoomJoined = function(data) {
      _roomId = data.room;
      _self.emit(mixr.enums.Events.JOIN_ROOM, data);
    };

    /**
     * Is triggered when a room was created successfully.
     *
     * @private
     * @function
     */
    var _onRoomCreated = function(data) {
      _roomId = data.room;
      _self.emit(mixr.enums.Events.CREATE_ROOM, data);
    };

    /**
     * Is triggered when the room that we are connected closes
     *
     * @private
     * @function
     * @param {Object} data The data.
     */
    var _onRoomClosed = function(data) {
      _roomId = null;
      _self.emit(mixr.enums.Events.ROOM_CLOSED, data);
    };

    /**
     * This is triggered when the server informs the room owner that a client
     * has joing it's room.
     *
     * @private
     * @function
     * @param {Object} data The data.
     */
    var _onClientJointed = function(data) {
      _self.emit(mixr.enums.Events.CLIENT_JOINED, data);
    };

    /**
     * Is triggered when the server informs the room owner that a client
     * has left the room on purpose.
     *
     * @private
     * @function
     * @param {Object} data The data.
     */
    var _onClientLeft = function(data) {
      _self.emit(mixr.enums.Events.CLIENT_LEFT, data);
    };

    var _onGetInstrument = function(data) {
      _self.emit(mixr.enums.Events.GET_INSTRUMENT, data);
    };

    var _onInstrument = function(data) {
      _self.emit(mixr.enums.Events.INSTRUMENT, data);
    };

    var _onNote = function(data) {
      console.log('Mixer got a note', data);
      _self.emit(mixr.enums.Events.INSTRUMENT, data);
    };
    /**
     * Is triggered when a command is executed and the results
     * are being send from the server.
     *
     * @private
     * @function
     * @param {Object} data The data that were send from the server.
     */
    var _onExecuted = function(data) {

      var response = new mixr.net.Response(data);

      var callbackObject = _calls[data.id];
      if (typeof callbackObject !== 'undefined') {
        if (response.success) {
          if (typeof callbackObject.callback !== 'undefined') {
            callbackObject.callback(response.data);
          }
        } else {
          if (typeof callbackObject.errback !== 'undefined') {
            callbackObject.errback(response.data);
          }
        }

        delete _calls[data.id];
      }
    };

    /**
     * Connects to a server
     *
     * @public
     * @function
     * @param {String} server The server url.
     * @return {mixr.net.Connection} Returns this instance.
     */
    this.connect = function(server) {
      _socket = io.connect(server);
      _socket.on(mixr.enums.Events.CONNECT, _onConnect)
      .on(mixr.enums.Events.DISCONNECT, _onDisconnect)
      .on(mixr.enums.Events.EXECUTE, _onExecuted)
      .on(mixr.enums.Events.JOIN_ROOM, _onRoomJoined)
      .on(mixr.enums.Events.CREATE_ROOM, _onRoomCreated)
      .on(mixr.enums.Events.REGISTER, _onRegistered)
      .on(mixr.enums.Events.ROOM_CLOSED, _onRoomClosed)
      .on(mixr.enums.Events.CLIENT_JOINED, _onClientJointed)
      .on(mixr.enums.Events.CLIENT_LEFT, _onClientLeft)
      .on(mixr.enums.Events.GET_INSTRUMENT, _onGetInstrument)
      .on(mixr.enums.Events.INSTRUMENT, _onInstrument)
      .on(mixr.enums.Events.NOTE, _onNote);

      return this;
    };

    /**
     * Disconnects from the server
     *
     * @public
     * @function
     * @return {mixr.net.Connection} Returns this instance.
     */
    this.disconnect = function() {
      _roomId = null;
      this.send(mixr.enums.Events.BYEBYE, {client: _clientId});

      return this;
    };

    /**
     * Sends a message to the server
     *
     * @public
     * @function
     * @param  {String} messageType The type of the message.
     * @param  {String|Object|Number|Boolean|Array} message The message data to send to the server.
     * @return {mixr.net.Connection} Returns this instance.
     */
    this.send = function(messageType, message) {

      if (typeof message === 'undefined') {
        message = {};
      }

      console.log('Sending message of type', messageType, 'with data', message);
      _socket.emit(messageType, message);

      return this;
    };


    /**
     * Executes a command
     *
     * @private
     * @function
     * @param {String} call The name of the call.
     * @param {Object} args An object with all the arguments.
     * @param {Function} callback The function that will be executed on success.
     * @param {Function} errback The function that will be executed on fail.
     * @return {mixr.net.Connection} This instance.
     */
    this.execute = function(call, args, callback, errback) {
      var timestamp = new Date().getTime() + Math.floor(Math.random() * 1500);

      _calls[timestamp] = {
        args: args || {},
        callback: callback || function() {},
        errback: errback || function() {}
      };

      this.send(mixr.enums.Events.EXECUTE, {client: _clientId, call: call, args: args, id: timestamp});

      return this;
    };

    /**
     * Joins a specific room
     * @param  {String} roomId The id of the room.
     * @param {Function} callback The function that will be executed on success.
     * @param {Function} errback The function that will be executed on fail.
     * @return {mixr.net.Connection} Returns this instance.
     */
    this.joinRoom = function(roomId, callback, errback) {
      this.execute(mixr.enums.Events.JOIN_ROOM, {room: roomId}, callback, errback);
      return this;
    };

    /**
     * Asks the server to create a room
     *
     * @public
     * @function
     * @param  {String} roomId The id of the new room.
     * @param {Function} callback The function that will be executed on success.
     * @param {Function} errback The function that will be executed on fail.
     * @return {mixr.net.Connection} Returns this instance.
     */
    this.createRoom = function(roomId, callback, errback) {
      this.execute(mixr.enums.Events.CREATE_ROOM, {room: roomId}, callback, errback);

      return this;
    };

    /**
     * Resolves a spotify URI to a playable URL
     *
     * @public
     * @function
     * @param {String} uri Track URI to resolve.
     * @param {Function} callback Callback with a string param of the audio URL.
     * @param {Function} errback Errback with a description.
     * @return {mixr.net.Connection} Returns this instance.
     */
    this.resolveURL = function(uri, callback, errback) {
      this.execute(mixr.enums.Events.RESOLVE_URL, {uri: uri}, callback, errback);

      return this;
    };

  };

}(io));
