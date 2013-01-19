(function() {

  mixr.Sequencer = function(conn) {

    /**
     * Mixins
     */
    mixr.mixins.EventTarget.call(this);

    var _clients = {};
    var _instruments = [];
    var _availableInstruments = [];
    var _tracks = {};
    var _context = null;
    var _masterGainNode = null;

    var _currentTime = 0;
    var _noteTime = 1;
    var _noteIndex = 0;
    var _startTime = 0;
    var _tempo = 120;
    var _loopLength = 16;
    var _started = false;
    var _lastDrawTime = -1;

    var _self = this;
    var _clients = {};

    var samplesPath = '../common/resources/12-TR-909/'; 

    var instrumentsConfig = [
        {
            type: 'samples',
            color: '#ffcc00',
            name: 'Drums',
            tracks: [
                {
                    name: 'HiHat',
                    sampleUrl: '909 HHCL 1.wav'
                }, {
                    name: 'Kick',
                    sampleUrl: '909 KIK1.wav'
                }, {
                    name: 'Tom HI',
                    sampleUrl: '909 HI.TOM1.wav'
                }, {
                    name: 'Snare',
                    sampleUrl: '909 SD1.wav'
                }, {
                    name: 'Tom Low',
                    sampleUrl: '909 LOWTOM1.wav'
                }    
            ]     
        }, {
            type: 'samples',
            color: '#deadf0',
            name: 'Toms',
            tracks: [
                {
                    name: 'Tom 1',
                    sampleUrl: '909 HI.TOM1.wav'
                }, {
                    name: 'Tom 2',
                    sampleUrl: '909 HI.TOM2.wav'
                }, {
                    name: 'Tom 3',
                    sampleUrl: '909 HI.TOM3.wav'
                }, {
                    name: 'Tom 4',
                    sampleUrl: '909 HI.TOM4.wav'
                }
            ]     
        }
        // , {
        //     type: 'synth',
        //     color: '@c0ffee',
        //     name: 'Nordic Lead',
        //     tracks: [
        //         {
        //             name: 'C',
        //             note: 'C-4'
        //         }, {
        //             name: 'D',
        //             note: 'D-4'
        //         }, {
        //             name: 'E',
        //             note: 'E-4'
        //         }, {
        //             name: 'F',
        //             note: 'F-4'
        //         }, {
        //             name: 'G',
        //             note: 'G-4'
        //         }
        //     ]
        // }
    ];
    
    this.initialize = function() {

        // Create context.
        _context = new webkitAudioContext();

        // Create master gain control.
        _masterGainNode = _context.createGainNode();
        _masterGainNode.gain.value = 0.7;
        _masterGainNode.connect(_context.destination);

        this.createInstruments();
    };

    this.createInstruments = function() {
        _instruments = [];
        for (var i = 0; i < instrumentsConfig.length; i++) {
            var tracks = this.createTracks(i, instrumentsConfig[i].tracks);
            var instrument = new mixr.models.Instrument(i, instrumentsConfig[i].name, tracks, 1.0);
            _instruments[i] = instrument;
        };

        _availableInstruments = _instruments.concat();
    };

    this.createTracks = function(instrumentId, tracksConfig) {
        var tracks = [];
        for (var i = 0; i < tracksConfig.length; i++) {
            var config = tracksConfig[i];
            var track = new mixr.models.Track(instrumentId + '-' + i, config.name, null, samplesPath + config.sampleUrl, 1.0);
            tracks.push(track);
        };

        return tracks;
    };

    this.getRandomInstrument = function(clientId) {

        console.log('>>> clientId')

        if (typeof _clients[clientId] !== 'undefined') {
            return _clients[clientId];
        }

        var numAvailableInstruments = _availableInstruments.length;
        if (numAvailableInstruments === 0) {
            console.log("No instruments available");
            return;
        }

        var randomIndex = Math.floor(Math.random() * numAvailableInstruments);
        var randomInstrument = _availableInstruments[randomIndex];
        _availableInstruments.splice(randomIndex, 1);
        randomInstrument.initialize(this.start);
        randomInstrument.loadTracks(_context);

        console.log("Released random instrument", randomInstrument);

        _clients[clientId] = randomInstrument;
        return randomInstrument;
    };

    this.start = function() {
        console.log('Started!', this);
        if (_started) return;
        _started = true;
        _noteTime = 0.0;
        // _startTime = _context.currentTime + 0.160;
        _startTime = _context.currentTime + 0.005;
        _self.schedule();
    };

    this.schedule = function() {
        var currentTime = _context.currentTime;

        // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
        currentTime -= _startTime;

        while (_noteTime < currentTime + 0.200) {

            // Convert noteTime to context time.
            var contextPlayTime = _noteTime + _startTime;

            for (var i = 0; i < _instruments.length; i++) {
                for (var j = 0; j < _instruments[i].tracks.length; j++) {
                    var track = _instruments[i].tracks[j];
                    var volume = track.notes[_noteIndex];
                    if (volume > 0 && _instruments[i].isLoaded()) {
                        _self.playNote(track, contextPlayTime, volume);
                    }
                }
            }

            // Attempt to synchronize drawing time with sound
            if (_noteTime+0.2 != _lastDrawTime) {
                _lastDrawTime = _noteTime;
                _self.emit(mixr.enums.Events.SEQUENCER_BEAT, _noteIndex);
            }

            _self.step();
        }

        requestAnimationFrame(_self.schedule);
    };

    this.playNote = function(track, noteTime, volume) {
        // Create the note
        var voice = _context.createBufferSource();
        voice.buffer = track.getBuffer();

        // Create a gain node.
        var gainNode = _context.createGainNode();
        // Connect the source to the gain node.
        voice.connect(gainNode);
        // Connect the gain node to the destination.
        gainNode.connect(_context.destination);

        // Reduce the volume.
        gainNode.gain.value = volume;

        // voice.connect(_context.destination);
        voice.noteOn(noteTime);
    };

    this.step = function() {
        // Advance time by a 16th note...
        var secondsPerBeat = 60.0 / _tempo;
        _noteTime += 0.25 * secondsPerBeat;
        _noteIndex++;

        if (_noteIndex == _loopLength) {
            _noteIndex = 0;
            // pattern++;
        }
    };

    this.updateNote = function(data) {
        console.log('update note', data);

        var trackId = data.trackId.split('-')[1]; 
        var instrumentId = data.trackId.split('-')[0]; 

        // TODO check the values MTF
        _instruments[data.id].tracks[trackId].notes[data.noteId] = data.volume;
        // _instruments[instrumentId].tracks[trackId].notes[data.noteId] = data.volume;
    };

    this.initialize();
  };

}());


