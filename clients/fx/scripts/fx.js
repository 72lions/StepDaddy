(function() {

  mixr.Fx = function() {

    var _isJoinedToRoom = null;
    var _conn;
    var _padsAreInitialized = false;
    var container = document.getElementById('modifiers');
    var modifiers = ['Cutoff' , 'Playback Rate'];

    var _onModifierChange = function(data) {
      _conn.execute(mixr.enums.Events.MODIFIER_CHANGE, data);
    };

    var _createPads = function() {
      for (var l = 0; l < modifiers.length; l += 1) {
        var pad = new mixr.ui.FxPad(l, modifiers[l], container).initialize();
        pad.on(mixr.enums.Events.MODIFIER_CHANGE, _onModifierChange);
      }
    };

    var _onRegistered = function(data) {
      console.log('Registered', data);
      if (_isJoinedToRoom) {
        _conn.joinRoom(_isJoinedToRoom, _onRoomJoined, function(e) {
          console.log('Room not joined!', e);
        });
      }
    };

    var _onDisconnect = function() {
      _conn.disconnect();
      _isJoinedToRoom = null;
    };

    var _onRoomJoined = function(data) {
      _isJoinedToRoom = data.room;
      console.log('Room joined!', data);
      $('#login').hide();
      if (!_padsAreInitialized) {
        _createPads();
        _padsAreInitialized = true;
      }

    };

    var _onJoinRoom = function() {

      _conn.joinRoom(document.getElementById('room_id').value,
          _onRoomJoined,
          function(e) {
            console.log('Room not joined!', e);
          });
    };

    var _onRoomClosed = function(data) {
      _isJoinedToRoom = false;
      console.log('Room with id', data.room, 'is closed. You have been removed from the room');
    };

    this.initialize = function() {

      document.getElementById('join_room').addEventListener('click', _onJoinRoom);

      _conn = new mixr.net.Connection();
      _conn.connect(window.SERVER)
      .on(mixr.enums.Events.REGISTER, _onRegistered)
      .on(mixr.enums.Events.ROOM_CLOSED, _onRoomClosed);

      return this;
    };

  };


  new mixr.Fx().initialize();

}());
