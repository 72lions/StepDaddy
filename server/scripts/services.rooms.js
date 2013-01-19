define([
  'sys',
  'mixins.wrapper',
  'services.room'
], function(sys, MixinsWrapper, Room) {

  /**
   * The RoomsManager class is responsible managing
   * all the rooms.
   *
   * @constructor
   * @class ConnectionsManager
   */
  var RoomsManager = function() {

    /**
     * A hash map with all the rooms
     *
     * @private
     * @type {Object}
     */
    var _rooms = {};

    /**
     * Creates a room
     *
     * @private
     * @function
     * @param {String} id The unique id of the room.
     * @param {Client} client The client.
     * @param {Function} callback The callback to be executed on success.
     * @param {Function} errback The callback to be executed on error.
     * @return {RoomsManager} Returns this instance.
     */
    this.createRoom = function(id, client, callback, errback) {

      if (typeof _rooms[id] === 'undefined') {
        _rooms[id] = new Room(id);
      }

      _rooms[id].registerRoomOwner(client, callback, errback);

      return this;
    };

    /**
     * Adds a client to a room
     * @param {String} roomId The id of the room the client wants to join.
     * @param {Client} client The client to join the room.
     * @param {Function} callback The callback to be executed on success.
     * @param {Function} errback The callback to be executed on error.
     * @return {RoomsManager} Returns this instance.
     */
    this.joinRoom = function(roomId, client, callback, errback) {
      // If the room exists
      if (typeof _rooms[roomId] !== 'undefined') {
        _rooms[roomId].registerClient(client, callback, errback);
      } else {
        errback('No room exists!');
      }
      return this;
    };

    /**
     * Removes a room.
     * @param {String} roomId The id of the room the client wants to join.
     * @param {Function} callback The callback to be executed on success.
     * @param {Function} errback The callback to be executed on error.
     * @return {RoomsManager} Returns this instance.
     */
    this.deleteRoom = function(roomId, callback, errback) {
      if (typeof _rooms[roomId] !== 'undefined') {
        _rooms[roomId].dispose();
        _rooms[roomId] = null;
      } else {
        errback('No room exists!');
      }

      return this;
    };

  };

  sys.inherits(RoomsManager, MixinsWrapper);

  return RoomsManager;

});
