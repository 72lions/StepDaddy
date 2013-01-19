(function() {

  mixr.Mixer = function() {

    var _room_id = 'Mixr_room_1';
    var _client_id = 'Mixr_mixer_1';
    var _conn;
    var _clients = {};

    var _itemsContainer = document.getElementById('connected_clients');

    var _onRoomCreated = function(data) {
      console.log('The room was created:', data.room);
      document.getElementById('room_title').innerText = data.room;
    };

    var _onRoomClosed = function(data) {
      console.log('The room with id', data.room, 'was closed.');
      _clients = {};
    };

    var _onRoomCreateError = function(error) {
      console.log('The room was not created');
    };

    var _onDisconnect = function() {
      _conn.disconnect();
      _clients = {};
    };

    var _onClientJoined = function(data) {

      var client = _clients[data.client];
      if (typeof client !== 'undefined') {
        console.log('A client with id', data.client, 're-joined the room');
      } else {
        console.log('A client with id ', data.client, 'joined the room');
      }

      _clients[data.client] = true;

      var element = '<div id="' + data.client + '" class="connected_client">' +
          '<span class="indicator"></span>' +
          '<label class="client_name">' + data.client + '</label>' +
          '</div>';

      _itemsContainer.innerHTML += element;

    };

    var _onClientLeft = function(data) {
      console.log('A client with id', data.client, 'left the room');
      var element = document.getElementById(data.client);
      _itemsContainer.removeChild(element);
    };

    this.initialize = function() {

      document.getElementById('disconnect').addEventListener('click', _onDisconnect);

      _conn = new mixr.net.Connection(_client_id);
      _conn.connect('http://localhost:8181')
      .on(mixr.enums.Events.REGISTER, function() {
            _conn.createRoom(_room_id, _onRoomCreated, _onRoomCreateError);
          })
      .on(mixr.enums.Events.CLIENT_JOINED, _onClientJoined)
      .on(mixr.enums.Events.ROOM_CLOSED, _onRoomClosed)
      .on(mixr.enums.Events.CLIENT_LEFT, _onClientLeft);
    };

  };

  new mixr.Mixer().initialize();

}());


