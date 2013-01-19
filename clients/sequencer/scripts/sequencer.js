(function() {

  mixr.Sequencer = function(conn) {

    var _clients = {};
    var _instruments = {};
    var _tracks = {};

    var intruments = [
    {
        name: 'HiHat',
        tracks: [
            {
                name: 'HiHat'
                sampleURL: '909 HHCL 1.wav'
            }        
        ]
    }, {
        name: 'Kick',
        tracks: [
            {
                name: 'Kick'
                sampleURL: '909 KIK1.wav'
            }        
        ]
    }, {
        name: 'Tom Hi',
        tracks: [
            {
                name: 'Tom HI'
                sampleURL: '909 HI.TOM1.wav'
            }        
        ]
    }, {
        name: 'Snare',
        tracks: [
            {
                name: 'Snare'
                sampleURL: '909 SD1.wav'
            }        
        ]
    }, {
        name: 'Tom Low',
        tracks: [
            {
                name: 'Tom Low'
                sampleURL: '909 LOWTOM1.wav'
            }        
        ]
    }
]


    this.initialize = function() {
      console.log('initialize Sequencer');
    };

    this.createInstruments = function() {

    };

    this.initialize();

  };

}());


