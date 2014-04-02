(function() {
    var updateTimeInterval;

    var toggleClickHandler = function(viewModel) {
        player.isPlaying ? player.stop() : player.play();
        this.playStatus(player.isPlaying ? 'Pause' : 'Play');
    };

    var muteClickHandler = function(viewModel) {
        player.mute(!player.isMuted);
        this.muteStatus(!player.isMuted ? 'Mute' : 'Unmute');
    };

    var progressClickHandler = function(viewModel, event) {
        var pos = event.target.value / 100;
        console.log(pos, player.duration())
        player.currentTime(pos * player.duration());
    };

    function changeSongHandler(viewModel, event) {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var song = {
                name: file.name,
                rawData: e.target.result
            }
            player.setSong(song, {
                autoplay: true
            }, function() {
                viewModel.playStatus('pause')
            });
        };
        reader.readAsArrayBuffer(event.target.files[0]);
        this.playStatus('Play');
    };


    function SongViewModel(model) {
        this.changeSong = changeSongHandler;
        this.toggleClick = toggleClickHandler;
        this.progressClick = progressClickHandler;
        this.muteClick = muteClickHandler;
        this.currentTime = ko.observable(0);
        this.duration = ko.observable();
        this.percent = ko.observable(0);
        this.playStatus = ko.observable('Play');
        this.muteStatus = ko.observable('Mute');

        updateTimeInterval = setInterval(updateTime.bind(this), 1000);
    }

    function updateTime() {
        if (!player.isPlaying) {
            return;
        }
        var time = player.currentTime();
        var duration = player.duration();

        this.currentTime(time);
        this.percent(time / duration * 100);
        this.duration(duration);
    };

    window.addEventListener('load', function() {
        window.player = new Player();
        ko.applyBindings(new SongViewModel());

    });
})();