(function() {

  mixr.Device = function() {

    var _isJoinedToRoom = null;
    var _patternEditor;
    var _conn;

    var _onRegistered = function(data) {
      console.log('Registered', data);
      if (_isJoinedToRoom) {
        _conn.joinRoom(_isJoinedToRoom, _onRoomJoined, function(e) {
          console.log('Room not joined!', e);
        });
      }

      var url = mixr.Utils.parseURL(location.href);

      if (url.query) {
        _conn.joinRoom(url.query,
            _onRoomJoined,
            function(e) {
              console.log('Room not joined!', e);
            });
      }
    };

    var _onEmit = function() {
      _conn.send(mixr.enums.Events.EMIT, { data: new Date().getTime() });
    };

    var _onDisconnect = function() {
      _conn.disconnect();
      _isJoinedToRoom = null;
    };

    var _onRoomJoined = function(data) {
      _isJoinedToRoom = data.room;
      console.log('Room joined!', data);
      _patternEditor = new mixr.controllers.PatternEditor(new mixr.models.PatternEditor(_conn)).initialize();
      _patternEditor.show();
    };

    var _onRoomClosed = function(data) {
      _isJoinedToRoom = false;
      console.log('Room with id', data.room, 'is closed. You have been removed from the room');
    };

    this.initialize = function() {

      _conn = new mixr.net.Connection();
      _conn.connect(window.SERVER)
      .on(mixr.enums.Events.REGISTER, _onRegistered)
      .on(mixr.enums.Events.ROOM_CLOSED, _onRoomClosed);

      setTimeout(function() {
        window.scrollTo(0, 1);
      }, 0);
    };

  };

  new mixr.Device().initialize();

}());


