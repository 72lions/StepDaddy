(function() {

  mixr.Sequencer = function(conn) {

    var _clients = {};
    var _instruments = {};
    var _tracks = {};

    var instrumentsConfig = [
    {
        name: 'HiHat',
        tracks: [
            {
                name: 'HiHat',
                sampleURL: '909 HHCL 1.wav'
            }        
        ]
    }, {
        name: 'Kick',
        tracks: [
            {
                name: 'Kick',
                sampleURL: '909 KIK1.wav'
            }        
        ]
    }, {
        name: 'Tom Hi',
        tracks: [
            {
                name: 'Tom HI',
                sampleURL: '909 HI.TOM1.wav'
            }        
        ]
    }, {
        name: 'Snare',
        tracks: [
            {
                name: 'Snare',
                sampleURL: '909 SD1.wav'
            }        
        ]
    }, {
        name: 'Tom Low',
        tracks: [
            {
                name: 'Tom Low',
                sampleURL: '909 LOWTOM1.wav'
            }        
        ]
    }];

    var samplesPath = '../common/resources/12-TR-909'; 

    this.initialize = function() {
      console.log('initialize Sequencer');
      this.createInstruments();
    };

    this.createInstruments = function() {
        _instruments = [];
        for (var i = 0; i < instrumentsConfig.length; i++) {
            var tracks = this.createTracks(i, instrumentsConfig[i].tracks);
            var instrument = new mixr.models.Instrument(i, instrumentsConfig[i].name, tracks);
            _instruments.push(instrument);
        };

        console.log('Instruments', _instruments);
    };

    this.createTracks = function(instrumentId, tracksConfig) {
        var tracks = []; 
        for (var i = 0; i < tracksConfig.length; i++) {
            var track = new mixr.models.Track(instrumentId + ':' + i, tracksConfig[i]);
            tracks.push(track);
        };

        return tracks;
    }

    this.initialize();
  };

}());


