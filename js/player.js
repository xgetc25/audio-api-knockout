/**
 * Player
 *
 */
function Player() {
    if (!window.webkitAudioContext) {
        throw new Error('AudioContext not supported. :(');
    }
    var context = new window.webkitAudioContext();
    var source = null;
    var audioBuffer = null;
    var p = Player.prototype;

    /**
     * [isPlaying description]
     * @type {Boolean}
     */
    this.isPlaying = false;
    /**
     * [gainNode description]
     * @type {[type]}
     */
    this.gainNode = null;

    /**
     * [isMuted description]
     * @type {Boolean}
     */
    this.isMuted = null;
    /**
     * song
     */
    this.currentSong = null;

    /**
     * [setSong description]
     * @param {[type]} song
     * @param {[type]} options
     */
    p.setSong = function(song, options, onPlayCallback) {
        context.decodeAudioData(song.rawData, function(buffer) {
            audioBuffer = buffer;
            this.currentSong = song;
            if (options.autoplay) {
                this.play(onPlayCallback);
            };
        }.bind(this), function(e) {
            console.log('Error decoding', e);
        });
    }

    /**
     * [play description]
     * @return {[type]}
     */
    p.play = function(onPlayCallback) {
        if (!audioBuffer || this.isPlaying) {
            return;
        }
        var time = time || 0;

        this.gainNode = context.createGain();
        source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = false;
        // volume filter insterting
        source.connect(this.gainNode);
        this.gainNode.connect(context.destination);
        source.start(0);
        this.isPlaying = true;
        onPlayCallback && onPlayCallback();
    };

    /**
     * [pause description]
     * @return {[type]}
     */
    p.pause = function() {
        this.isPlaying = false;
        source.pause();
    };

    /**
     * [stop description]
     * @return {[type]}
     */
    p.stop = function() {
        if (!source) {
            return;
        }
        console.log('player - stopping');
        source.stop(0);
        this.isPlaying = false;
    };
    /**
     * [mute description]
     * @return {[type]}
     */
    p.mute = function(muted) {
        if (!source) {
            return;
        }
        muted ? this.volume(0) : this.volume(1);
        this.isMuted = muted;
    };
    /**
     * [volume description] from 0 to 1
     * @return {[type]}
     */
    p.volume = function(volume) {
        if (typeof volume === 'undefined') {
            return this.gainNode.gain.value;
        }
        this.gainNode.gain.value = volume;
    };

    p.currentTime = function(time) {
        if (typeof time === 'undefined') {
            return context.currentTime;
        }
        console.log(time)

    };

    p.duration = function() {
        if (!audioBuffer) {
            return;
        }
        return Math.floor(audioBuffer.duration);
    };



};