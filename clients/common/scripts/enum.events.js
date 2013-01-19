(function() {

  /**
   * The events object holds all the enumrations for different events.
   * @type {Object}
   */
  mixr.enums.Events = {

    /**
     * The BYEBYE enum
     * @type {String}
     */
    BYEBYE: 'byebye',

    /**
     * The EMIT enum
     * @type {String}
     */
    EMIT: 'emit',

    /**
     * The CONNECT enum
     * @type {String}
     */
    CONNECT: 'connect',

    /**
     * The DISCONNECT enum
     * @type {String}
     */
    DISCONNECT: 'disconnect',

    /**
     * The REGISTER enum
     * @type {String}
     */
    REGISTER: 'register',

    /**
     * The JOIN_ROOM enum
     * @type {String}
     */
    JOIN_ROOM: 'join_room',

    /**
     * The CREATE_ROOM enum
     * @type {String}
     */
    CREATE_ROOM: 'create_room',

    /**
     * The SEARCH enum
     * @type {String}
     */
    SEARCH: 'search',

    /**
     * The RESOLVE_URL enum. Used for mapping the Spotify URIs to
     * downloadable URLs of songs.
     * @type {String}
     */
    RESOLVE_URL: 'resolve_url',

    /**
     * The SEARCH enum
     * @type {String}
     */
    EXECUTE: 'execute',

    /**
     * The ROOM_CLOSED enum is triggered when the room owner
     * of a room is disconnected from the room on purpose.
     * @type {String}
     */
    ROOM_CLOSED: 'room_closed',

    /**
     * This event is send when a new client is connected to a room.
     * @type {String}
     */
    CLIENT_JOINED: 'client_joined',

    /**
     * This event is send when a client leaves the room on purpose.
     * @type {String}
     */
    CLIENT_LEFT: 'client_left'
  };

}());
