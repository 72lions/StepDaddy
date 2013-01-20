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

    var samplesPath = '../common/resources/';

    var instrumentsConfig = [
        {
            type: 'samples',
            color: '#517CBD',
            name: 'Bass synth',
            tracks: [
                {
                    name: 'A',
                    sampleUrl: 'bass/Bass1_1.mp3'
                }, {
                    name: 'H',
                    sampleUrl: 'bass/Bass1_2.mp3'
                },
                {
                    name: 'C#',
                    sampleUrl: 'bass/Bass1_3.mp3'
                },
                {
                    name: 'E',
                    sampleUrl: 'bass/Bass1_4.mp3'
                },
                {
                    name: 'F#',
                    sampleUrl: 'bass/Bass1_5.mp3'
                },
                {
                    name: 'A',
                    sampleUrl: 'bass/Bass1_6.mp3'
                },
                {
                    name: 'H',
                    sampleUrl: 'bass/Bass1_7.mp3'
                },
                {
                    name: 'C#',
                    sampleUrl: 'bass/Bass1_8.mp3'
                }
            ]
        }, {
            type: 'samples',
            color: '#51ACBD',
            name: 'Bass DRY synth',
            tracks: [
                {
                    name: 'A',
                    sampleUrl: 'bassdry/Bass3_1.mp3'
                }, {
                    name: 'H',
                    sampleUrl: 'bassdry/Bass3_2.mp3'
                },
                {
                    name: 'C#',
                    sampleUrl: 'bassdry/Bass3_3.mp3'
                },
                {
                    name: 'E',
                    sampleUrl: 'bassdry/Bass3_4.mp3'
                },
                {
                    name: 'F#',
                    sampleUrl: 'bassdry/Bass3_5.mp3'
                },
                {
                    name: 'A',
                    sampleUrl: 'bassdry/Bass3_6.mp3'
                },
                {
                    name: 'H',
                    sampleUrl: 'bassdry/Bass3_7.mp3'
                },
                {
                    name: 'C#',
                    sampleUrl: 'bassdry/Bass3_8.mp3'
                }
            ]   
        }, {
            type: 'samples',
            color: 'hotpink',
            name: 'Drum kit',
            tracks: [
                {
                    name: 'Kick',
                    sampleUrl: '12-TR-909/909 KIK2.wav'
                }, {
                    name: 'Snare',
                    sampleUrl: '12-TR-909/909 SD1.wav'
                },  {
                    name: 'Snare long',
                    sampleUrl: '12-TR-909/909 SD3.wav'
                }, {
                    name: 'HiHat',
                    sampleUrl: '12-TR-909/909 HHCL 1.wav'
                }, {
                    name: 'HiHat open',
                    sampleUrl: '12-TR-909/909 HHOP.wav'
                },
            ]
        }, {
            type: 'samples',
            color: '#deadf0',
            name: 'Percussion',
            tracks: [
                {
                    name: 'Clap',
                    sampleUrl: '12-TR-909/909 CLAP.wav'
                }, {
                    name: 'Rim',
                    sampleUrl: '12-TR-909/909 RIM.wav'
                }, {
                    name: 'Tom 1',
                    sampleUrl: '12-TR-909/909 HI.TOM1.wav'
                }, {
                    name: 'Tom 2',
                    sampleUrl: '12-TR-909/909 HI.TOM2.wav'
                }
            ]
        }
        // ,{
        //     type: 'synth',
        //     color: '#c0ffee',
        //     name: 'Nordic Lead',
        //     tracks: [
        //         {
        //          name: 'A2',
        //          note: 0
        //         }, {
        //          name: 'C2',
        //          note: 3
        //         }, {
        //          name: 'D2',
        //          note: 5
        //         }, {
        //          name: 'E2',
        //          note: 7
        //         }, {
        //          name: 'G2',
        //          note: 10
        //         }, {
        //          name: 'A3',
        //          note: 12
        //         }, {
        //          name: 'C3',
        //          note: 15
        //         }, {
        //          name: 'D3',
        //          note: 17
        //         }, {
        //          name: 'E3',
        //          note: 19
        //         }, {
        //          name: 'G3',
        //          note: 21
        //         }
        //     ]
        // }
    ];


    var _lowpassFilter = null;
    var _compressor = null;
    var _masterDry = null;
    var _masterWet = null;
    var _masterDelaySend = null;
    var _delay = null;
    var _reverb = null;
    var _highpassFilter = null;

    var _highpassFilterFreq = 0;
    var _filterFreq = 22000;

    var _delayAmount = 0.125;
    var _delayTime = 0;

    var effectsConfig = [
        {
            id: 0,
            name: 'Delay',
            y: {
                name: 'Amount',
                param: '_delayAmount',
                min: 0,
                max: 1
            },
            x: {
                name: 'Time',
                param: '_delayTime',
                min: 0,
                max: 1
            }
        }, {
            id: 1,
            name: 'Filter',
            y: {
                name: 'filterCutoff',
                min: 0,
                max: 1
            },
            x: {
                name: '_filterFreq',
                min: 200,
                max: 22000
            }
        }, {
            id: 2,
            name: 'Reverb',
            y: {
                name: 'reverbAmount',
                min: 0,
                max: 0
            },
            x: {
                name: '',
                min: 0,
                max: 0
            }
        }, {
            id: 3,
            name: 'Filter Hi',
            y: {
                name: '_highpassFilterFreq',
                min: 0,
                max: 5000
            },
            x: {
                name: '',
                min: 0,
                max: 0
            }
        }
    ];

    // FX

    this.initialize = function() {

        // Create context.
        _context = new webkitAudioContext();

        // Create master gain control.
        _masterGainNode = _context.createGainNode();
        _masterGainNode.gain.value = 0.7;
        
        //create lowpass filter
        _lowpassFilter = _context.createBiquadFilter();
        _lowpassFilter.frequency.value = _filterFreq;
        
        //create lowpass filter
        _highpassFilter = _context.createBiquadFilter();
        _highpassFilter.type = 1;
        _highpassFilter.frequency.value = _highpassFilterFreq;
        
        //create compressor
        _compressor = _context.createDynamicsCompressor();
        _compressor.treshold = -20;
        _compressor.attack = 1;
        _compressor.release = 250;
        _compressor.ratio = 4;
        _compressor.knee = 5;

        // Create master wet and dry.
        _masterDry = _context.createGainNode();
        _masterWet = _context.createGainNode();
        _masterDelaySend = _context.createGainNode();
        _masterDry.gain.value = 1;
        _masterWet.gain.value = 0;
        
        // Create delay
        _delay = _context.createDelay();

        // Create reverb
        _reverb = _context.createConvolver();
        
        _compressor.connect(_context.destination);
        // Connect master dry and wet to compressor.
        _masterDry.connect(_compressor);
        _masterWet.connect(_compressor);
        _masterDelaySend.connect(_compressor);
        
        // Connect delay to master wet.
        _delay.connect(_masterDelaySend);
        // _reverb.connect(_masterWet);
        
        //connect lowpass filter
        _lowpassFilter.connect(_masterDry);
        _lowpassFilter.connect(_masterWet);
        _lowpassFilter.connect(_masterDelaySend);
        
        _highpassFilter.connect(_lowpassFilter);
        _masterGainNode.connect(_highpassFilter);

        // Create master gain control.
        _masterGainNode = _context.createGainNode();
        _masterGainNode.gain.value = 0.7;
        _masterGainNode.connect(_context.destination);

        this.setFxValues();

        this.createInstruments();
    };

    this.setFxValues = function() {

        _delay.delayTime.value = _delayTime;
        _masterDelaySend.gain.value = _delayAmount;
    }

    this.createInstruments = function() {
        _instruments = [];
        for (var i = 0; i < instrumentsConfig.length; i++) {
            var tracks = this.createTracks(i, instrumentsConfig[i].tracks, instrumentsConfig[i].type);
            var instrument = new mixr.models.Instrument(i, instrumentsConfig[i].name, tracks, 1.0, instrumentsConfig[i].type, instrumentsConfig[i].color);
            _instruments.push(instrument);
        };

        _availableInstruments = _instruments.concat();
    };

    this.createTracks = function(instrumentId, tracksConfig, type) {
        console.log('createTracks');
        var tracks = [];
        for (var i = 0; i < tracksConfig.length; i++) {
            var config = tracksConfig[i];

            if (type === 'samples') {
                var track = new mixr.models.Track(instrumentId + '-' + i, config.name, null, samplesPath + config.sampleUrl, 1.0);
            } else {
                var track = new mixr.models.Track(instrumentId + '-' + i, config.name, null, null, 1.0);
                track.note = config.note;
                console.log('track', track);
            };
            tracks.push(track);
        }

        return tracks;
    };

    this.addInstrument = function(instrument) {
        // Reset the notes of all the tracks
        for (var n = 0, len = instrument.tracks.length; n < len; n += 1) {
            var track = instrument.tracks[n];
            instrument.tracks[n].resetNotes()
        }
        _availableInstruments.push(instrument);
    };

    this.getNextInstrument = function(clientId) {
        if (typeof _clients[clientId] !== 'undefined') {
            return _clients[clientId];
        }

        var numAvailableInstruments = _availableInstruments.length;
        if (numAvailableInstruments === 0) {
            console.log("No more instruments available");
            return;
        }

        var nextInstrument = _availableInstruments[0];
        _availableInstruments.shift();

        // Initialize the instrument and call start when ready.
        nextInstrument.initialize(this.start);
        // Pass the context the instrument.
        nextInstrument.setup(_context);

        console.log("Released random instrument", nextInstrument);

        _clients[clientId] = nextInstrument;
        return nextInstrument;
    };

    this.getRandomInstrument = function(clientId) {
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

        // Initialize the instrument and call start when ready.
        randomInstrument.initialize(this.start);
        // Pass the context the instrument.
        randomInstrument.setup(_context);

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
                    if (_instruments[i].type === 'samples' && _instruments[i].isLoaded()) {
                        if (volume > 0) {
                            _self.playNote(track, contextPlayTime, volume);
                        }
                    } else if (_instruments[i].type === 'synth') {

                        if (volume > 0) {
                            _instruments[i].play(track.note);
                        } else {
                            _instruments[i].stop();
                        }
                    }
                }
            }

            // Attempt to synchronize drawing time with sound
            if (_noteTime != _lastDrawTime) {
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
        gainNode.connect(_masterGainNode);

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

    this.updateFxParam = function(data) {
        console.log('update fx param', data);

        var fxConfig = effectsConfig[data.id];
        paramX = fxConfig.x.param;
        paramY = fxConfig.y.param;
        valueX = this.interpolate(data.x, fxConfig.x.min, fxConfig.x.max);
        valueY = this.interpolate(data.y, fxConfig.y.min, fxConfig.y.max);
        this[paramX] = valueX;
        this[paramY] = valueY;

        console.log('update', paramX, ':', valueX);
        console.log('update', paramY, ':', valueY);

        this.setFxValues();
    };
        
    this.interpolate = function(value, minimum, maximum) {
        return minimum + (maximum - minimum) * value;
    }
        
    this.initialize();
  };

}());


