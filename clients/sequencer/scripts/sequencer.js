(function() {

  mixr.Sequencer = function(conn) {

    var _clients = {};
    var _instruments = [];
    var _availableInstruments = [];
    var _tracks = {};
    var _context = null;

    var instrumentsConfig = [
    {
        name: 'HiHat',
        tracks: [
            {
                name: 'HiHat',
                sampleUrl: '909 HHCL 1.wav'
            }        
        ]
    }, {
        name: 'Kick',
        tracks: [
            {
                name: 'Kick',
                sampleUrl: '909 KIK1.wav'
            }        
        ]
    }, {
        name: 'Tom Hi',
        tracks: [
            {
                name: 'Tom HI',
                sampleUrl: '909 HI.TOM1.wav'
            }        
        ]
    }, {
        name: 'Snare',
        tracks: [
            {
                name: 'Snare',
                sampleUrl: '909 SD1.wav'
            }        
        ]
    }, {
        name: 'Tom Low',
        tracks: [
            {
                name: 'Tom Low',
                sampleUrl: '909 LOWTOM1.wav'
            }        
        ]
    }];

    var samplesPath = '../common/resources/12-TR-909/'; 

    this.initialize = function() {
      _context = new webkitAudioContext();
      console.log('initialize Sequencer', _context);
      this.createInstruments();
    };

    this.createInstruments = function() {
        _instruments = [];
        for (var i = 0; i < instrumentsConfig.length; i++) {
            var tracks = this.createTracks(i, instrumentsConfig[i].tracks);
            var instrument = new mixr.models.Instrument(i, instrumentsConfig[i].name, tracks, 1.0);
            _instruments.push(instrument);
        };

        _availableInstruments = _instruments.concat();

        console.log('Instruments', _instruments);
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

    this.getRandomInstrument = function() {
        var numAvailableInstruments = _availableInstruments.length;
        if (numAvailableInstruments === 0) {
            console.log("No instruments available");
            return;
        }
        var randomIndex = Math.floor(Math.random() * numAvailableInstruments);
        var randomInstrument = _availableInstruments[randomIndex];
        _availableInstruments.splice(randomIndex, 1);
        randomInstrument.initialize();
        randomInstrument.loadTracks(_context);
        console.log("Released random instrument", randomInstrument);
        return randomInstrument;
    };

    this.step = function() {
        // Advance time by a 16th note...
        var secondsPerBeat = 60.0 / tempo;
        noteTime += 0.25 * secondsPerBeat;

        noteIndex++;
        if (noteIndex == loopLength) {
            noteIndex = 0;
            pattern++;
        }
    };

    this.initialize();
  };

}());


