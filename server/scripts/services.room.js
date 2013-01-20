define(['sys', 'mixins.wrapper'], function(sys, MixinsWrapper) {
  /**
   * A room is responsible for holding a list of clients that connected
   * to this room, adding/removing clients, broadcasting to all clients or
   * to a specific client.
   *
   * @constructor
   * @class Room
   * @param {String} id The id of the room.
   */
  var Room = function(id) {

    console.log('Creating a new room with id', id);

    /**
     * The id of this room
     *
     * @type {String}
     */
    this.id = id || '';

    /**
     * A reference to this specific instance.
     *
     * @private
     * @type {Room}
     */
    var _self = this;

    /**
     * The client that created the room and that manages the entir room
     *
     * @private
     * @type {Client}
     */
    var _roomOwnerClient;

    /**
     * A hash map with all the sockets
     *
     * @private
     * @type {Object}
     */
    var _roomOwners = {};

    /**
     * A hash map with all the sockets
     *
     * @private
     * @type {Object}
     */
    var _clients = {};

    /**
     * It is triggered when the room owner is disconnected in purpose and
     * it then removes all the clients from the room.
     *
     * @private
     * @function
     */
    var _removeAllFromRoom = function() {
      for (id in _clients) {
        _self.notifyClient(id, 'room_closed', {room: _self.id});
        _self.removeClient(id);
      }
    };

    /**
     * It is triggered when the client triggers a disconnect event
     *
     * @private
     * @function
     * @param {Object} data The data of the event.
     */
    var _onClientBye = function(data) {
      console.log('Removing client with id', data.client, 'from room with id', _self.id);
      if (data.client === _roomOwnerClient.id) {
        _removeAllFromRoom();
      } else {
        // Inform the room creator that a client left.
        _roomOwnerClient.send('client_left', {client: data.client});
      }
      delete _clients[data.client];
    };

    var _onGetInstrument = function(data) {
      _roomOwnerClient.send('get_instrument', {client: data.client});
    };

    var _onNote = function(data) {
      _roomOwnerClient.send('note', {client: data.client, args: data.args});
    };

    var _onInstrument = function(data) {
      var receiver = _clients[data.args.receiver];
      if (receiver) {
        receiver.send('instrument', data.args.instrument);
      }

    };

    var _onModifierChange = function(data) {
      _roomOwnerClient.send('modifier_change', {client: data.client, args: data.args});
    };

    var _onSeqencerBeat = function(data) {
      _self.broadcast('seq_beat', data);
    };

    /**
     * Registers all the event listeners for a client
     *
     * @private
     * @function
     * @param {Client} client The client that we want to register for it's events.
     */
    var _addEventListeners = function(client) {
      console.log('Registering room specific event listeners for client', client.id);
      client.on('get_instrument', _onGetInstrument)
      .on('instrument', _onInstrument)
      .on('modifier_change', _onModifierChange)
      .on('note', _onNote)
      .on('disconnect', _onClientBye)
      .on('byebye', _onClientBye)
      .on('seq_beat', _onSeqencerBeat);
    };

    /**
     * Registers a room owner
     *
     * @public
     * @function
     * @param {Client} client The client to join this room.
     * @param {Function} callback The callback to be executed on success.
     * @param {Function} errback The callback to be executed on error.
     * @return {Room} This instance.
     */
    this.registerRoomOwner = function(client,  callback, errback) {
      var alreadyExists = false;
      console.log('Registering as room owner the client with id', client.id);

      if (typeof _roomOwners[client.id] !== 'undefined') {
        _roomOwners[client.id] = null;
        alreadyExists = true;
      }

      _roomOwnerClient = client;
      _roomOwners[client.id] = client;

      if (!alreadyExists) {
        console.log('Adding event listeners for', client.id);
        _addEventListeners(client);
      }

      callback({room: this.id, client: client.id});
      return this;
    };

    /**
     * Registers a clien to this room
     *
     * @public
     * @function
     * @param {Client} client The client to join this room.
     * @param {Function} callback The callback to be executed on success.
     * @param {Function} errback The callback to be executed on error.
     * @return {Room} This instance.
     */
    this.registerClient = function(client, callback, errback) {
      var alreadyExists = false;
      console.log('Need to register client!', client);
      if (typeof _clients[client.id] !== 'undefined') {
        _clients[client.id] = null;
        alreadyExists = true;
      }

      _clients[client.id] = client;

      if (!alreadyExists) {
        _addEventListeners(client);
      }

      callback({room: this.id, client: client.id});

      if (_roomOwnerClient) {
        // Inform the room owner that a new client has
        // connected to the room
        _roomOwnerClient.send('client_joined', {client: client.id});
      }

      return this;
    };

    /**
     * Removes a client from this room
     *
     * @public
     * @function
     * @param {String} id The id of the client that we need to remove.
     * @return {Room} The instance of this class.
     */
    this.removeClient = function(id) {
      if (typeof _clients[id] !== 'undefined') {
        delete _clients[id];
      }
      return this;
    };

    /**
     * Notifies a client
     *
     * @public
     * @function
     * @param {String} id The id of the client.
     * @param {String} messageType The type of the message type  of the message
     *     to send to the client.
     * @param {Object} args The arguments to send to the client.
     * @return {Room} The instance of this class.
     */
    this.notifyClient = function(id, messageType, args) {
      if (typeof _clients[id] !== 'undefined') {
        _clients[id].send(messageType, args);
      }
    };

    /**
     * Broadcasts to all clients a message
     * @param {String} messageType The type of the message type  of the message
     *     to send to the client.
     * @param {Object} args The arguments to send to the client.
     * @return {Room} The instance of this class.
     */
    this.broadcast = function(messageType, args) {
      for (id in _clients) {
        _self.notifyClient(id, messageType, args);
      }
      return this;
    };

    /**
     * Disposes the room by informing all clients and removing them
     * from the room.
     *
     * @public
     * @function
     * @return {Room} The instance fo tihs class.
     */
    this.dispose = function() {
      _removeAllFromRoom();
      _roomOwnerClient.send('room_closed', {room: this.id});
      _roomOwnerClient = null;
    };

  };

  sys.inherits(Room, MixinsWrapper);

  return Room;

});
