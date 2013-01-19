define([
  'express',
  'http',
  'socket.io',
  'sys',
  'mixins.wrapper',
  'services.rooms',
  'net.client'
], function(express, http, socket, sys, MixinsWrapper, RoomsManager, Client) {

  /**
   * The Connection class is responsible for creating a server
   * and opening a port for the clients to connect to.
   *
   * @constructor
   * @class Server
   */
  var Server = function() {

    /**
     * The default port
     *
     * @private
     * @type {Number}
     */
    var PORT = 8181;

    /**
     * The app
     *
     * @private
     * @type {Object}
     */
    var _app;

    /**
     * The http server
     *
     * @private
     * @type {Object}
     */
    var _server;

    /**
     * The websockets interface
     *
     * @private
     * @type {Object}
     */
    var _io;

    /**
     * Holds this specific instance of this class
     *
     * @private
     * @type {ConnectionsManager}
     */
    var _self = this;

    /**
     * A hash map with all the sockets
     *
     * @private
     * @type {Object}
     */
    var _clients = {};

    /**
     * The rooms manager is responsible for managing all the rooms.
     *
     * @private
     * @type {RoomsManager}
     */
    var _roomsManager = new RoomsManager();

    /**
     * It adds all the event listeners to the connection
     *
     * @private
     * @function
     */
    var _addEventListeners = function() {

      _io.sockets.on('connection', function(socket) {

        socket.on('register', function(data) {
          console.log('Registering socket with id', data.client);
          _self.register(data.client, socket);
        });

      });
    };

    /**
     * It is triggered when the client triggers an emit event
     *
     * @private
     * @function
     * @param {Object} data The data of the event.
     */
    var _onClientEmit = function(data) {
      console.log('Emit', data);
    };

    /**
     * It is triggered when the client triggers a create_room event
     *
     * @private
     * @function
     * @param {Object} data The data of the event.
     */
    var _onClientCreateRoom = function(data) {
      _roomsManager.createRoom(data.args.room, _clients[data.client],
          function(response) {
            _clients[data.client].send('execute', {success: true, id: data.id, response: response});
          }, function(error) {
            _clients[data.client].send('execute', {success: false, id: data.id, response: error});
          });
    };

    /**
     * It is triggered when the client triggers a join_room event
     *
     * @private
     * @function
     * @param {Object} data The data of the event.
     */
    var _onClientJoinRoom = function(data) {
      _roomsManager.joinRoom(data.args.room, _clients[data.client],
          function(response) {
            _clients[data.client].send('execute', {success: true, id: data.id, response: response});
          }, function(error) {
            _clients[data.client].send('execute', {success: false, id: data.id, response: error});
          });
    };

    /**
     * It is triggered when the client triggers a byebye event
     *
     * @private
     * @function
     * @param {Object} data The data of the event.
     */
    var _onClientBye = function(data) {
      _self.unregister(data.client);
    };

    /**
     * Is triggered when the client triggers the search event
     *
     * @private
     * @function
     * @param {Object} data The data.
     */
    var _onSearch = function(data) {
      _clients[data.client].send('execute', {success: true, id: data.id, response: 'you searched for ' + data.args.keyword});
    };

    /**
     * Gets a uri and returns a url.
     *
     * @private
     * @function
     * @param {Object} data This data.
     */
    var _onResolveURL = function(data) {
      _clients[data.client].send('execute', {success: true, id: data.id, response: 'http://localhost:8282/common/resources/Kavinsky - Nightcall (Feat. Lovefoxxx).mp3'});
    };

    /**
     * Registers a new connection/socket
     *
     * @private
     * @function
     * @param {String} clientId The id of the socket/client.
     * @param {Object} socket The socket to register.
     * @return {ConnectionsManager} This instance of the ConnectionManager.
     */
    this.register = function(clientId, socket) {

      // If we are trying to register a client with an id that already is
      // registered this probably means that the client lost connection
      // and reconnected. So what we do is just update the client class
      // with the new socket.
      if (typeof _clients[clientId] !== 'undefined') {
        console.log('Client already exists, will just update the socket');
        _clients[clientId].setSocket(socket);
      } else {
        // If this is a new socket then we create a new client
        // class and register all the events to it.
        _clients[clientId] = new Client(clientId, socket)
          .on('emit', _onClientEmit)
          .on('byebye', _onClientBye)
          .on('create_room', _onClientCreateRoom)
          .on('join_room', _onClientJoinRoom)
          .on('search', _onSearch)
          .on('resolve_url', _onResolveURL);
      }

      _clients[clientId].send('register', clientId);

      return this;
    };

    /**
     * Unregisters an already existing connection/socket
     *
     * @private
     * @function
     * @param {String} id The id of the socket/client.
     * @return {ConnectionsManager} This instance of the ConnectionManager.
     */
    this.unregister = function(id) {
      console.log('Removing client with id', id);
      if (typeof _clients[id] !== 'undefined') {
        _clients[id] = null;
        delete _clients[id];
      }

      return this;
    };

    /**
     * Initializes the connection
     *
     * @public
     * @function
     * @return {Server} This instance of the server class.
     */
    this.initialize = function() {

      _app = express();
      _server = http.createServer(_app);
      _io = socket.listen(_server);
      _io.set('log level', 1);

      _addEventListeners();
      return this;
    };

    /**
     * Opens a connection for the clients to connect to
     * and listen to.
     *
     * @private
     * @function
     * @param {Number} port The port that will be used.
     * @return {Server} This instance of the server class.
     */
    this.start = function(port) {
      _server.listen(port || PORT);
      return this;
    };

  };

  sys.inherits(Server, MixinsWrapper);

  return Server;

});
