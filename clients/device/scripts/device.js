(function() {

  mixr.Device = function() {

    var _client_id = 'Mixr_client_1';
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
      $('#login').hide();
      _patternEditor.show();
    };

    var _onJoinRoom = function() {

      _conn.joinRoom(document.getElementById('room_id').value,
          _onRoomJoined,
          function(e) {
            console.log('Room not joined!', e);
          });
    };

    var _onConnect = function(e) {

      _client_id = document.getElementById('client_id').value;
      _conn = new mixr.net.Connection(_client_id);
      _conn.connect('http://10.48.19.121:8181')
      .on(mixr.enums.Events.REGISTER, _onRegistered)
      .on(mixr.enums.Events.ROOM_CLOSED, _onRoomClosed);
    };

    var _onRoomClosed = function(data) {
      _isJoinedToRoom = false;
      console.log('Room with id', data.room, 'is closed. You have been removed from the room');
    };

    this.initialize = function() {

      document.getElementById('join_room').addEventListener('click', _onJoinRoom);

      _conn = new mixr.net.Connection();
      _conn.connect('http://10.48.19.160:8181')
      .on(mixr.enums.Events.REGISTER, _onRegistered)
      .on(mixr.enums.Events.ROOM_CLOSED, _onRoomClosed);

      setTimeout(function () {
        window.scrollTo(0,1);
      }, 0);
    };

  };

  new mixr.Device().initialize();

}());


