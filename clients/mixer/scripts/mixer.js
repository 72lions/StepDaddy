(function() {

  mixr.Mixer = function() {

    var _room_id = 'Mixr_room_1';
    var _conn;
    var _clients = {};
    var _instruments = {};

    var _sequencer;
    var _sequencerView;

    var _onRoomCreated = function(data) {
      console.log('The room was created:', data.room);
      //document.getElementById('room_title').innerText = data.room;
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

    };

    var _onClientLeft = function(data) {
      console.log('A client with id', data.client, 'left the room');
      var instrument = _instruments[data.client];
      if (typeof instrument !== 'undefined') {
        _sequencerView.removeInstrument(instrument);
        _sequencer.addInstrument(instrument);
        delete _instruments[data.client];
      }
    };

    var _onGetInstrument = function(data) {
      console.log('Got a request for an instrument', data);

      // var instrument = _sequencer.getRandomInstrument(data.client);
      var instrument = _sequencer.getNextInstrument(data.client);

      if (instrument) {
        _conn.execute(mixr.enums.Events.INSTRUMENT, {receiver: data.client, instrument: instrument});
        console.log(">>> Instrument", instrument);
        if (typeof _instruments[data.client] === 'undefined') {
          _sequencerView.addInstrument(instrument);
          _instruments[data.client] = instrument;
        }
      } else {
        console.log('No more instruments available.');
      }
    };

    var _onNote = function(data) {
      _sequencerView.updateNote(data.args);
      _sequencer.updateNote(data.args);
    };

    var _onModifierChange = function(data) {
      _sequencer.updateFxParam(data.args);
    };

    this.initialize = function() {

      _conn = new mixr.net.Connection();
      _conn.connect('http://10.48.19.160:8181')
      .on(mixr.enums.Events.REGISTER, function() {
            _conn.createRoom(_room_id, _onRoomCreated, _onRoomCreateError);
          })
      .on(mixr.enums.Events.CLIENT_JOINED, _onClientJoined)
      .on(mixr.enums.Events.ROOM_CLOSED, _onRoomClosed)
      .on(mixr.enums.Events.CLIENT_LEFT, _onClientLeft)
      .on(mixr.enums.Events.GET_INSTRUMENT, _onGetInstrument)
      .on(mixr.enums.Events.NOTE, _onNote)
      .on(mixr.enums.Events.MODIFIER_CHANGE, _onModifierChange);

      _sequencer = new mixr.Sequencer();

      _sequencerView = new mixr.views.SequencerView(document.getElementById('sequencer-view')).initialize();

      _sequencer.on(mixr.enums.Events.SEQUENCER_BEAT, function(beat) {
        _sequencerView.drawPlayhead(beat);
        _conn.execute(mixr.enums.Events.SEQUENCER_BEAT, {beat: beat});
      });
    };

  };

  new mixr.Mixer().initialize();

}());


