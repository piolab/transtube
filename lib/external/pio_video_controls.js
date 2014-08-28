Meteor.PioVideoControl = {
    initVideoControl : function (videoController) {
        var currentTime = 0, totalTime = 0;
        $("#pio-volume-control").click(function(e){
            var xpos = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX;

            var percent = xpos / $("#pio-volume-control").width() * 100;
            var progressbar = $("#pio-volume-control-progressbar");
            progressbar.width(percent + "%");
            progressbar.attr("aria-valuenow", percent);
            videoController.volume(percent/100);
            console.log(percent);
        });

        $("#pio-timeline").click(function(e){
            var xpos = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX;
            var percent = xpos / $("#pio-timeline").width();
            if (totalTime == 0) return;
            var seconds = totalTime * percent;
            console.log(seconds);
            videoController.play(seconds);
        });

        videoController.listen( "timeupdate", function() {
            if (currentTime != this.roundTime()) {
                currentTime = this.roundTime();
                $("#pio-player-current-time").html(currentTime.toString().toHHMMSS());
            }

            if (totalTime == 0) {
                totalTime = this.duration();
                $("#pio-player-total-time").html(totalTime.toString().toHHMMSS());
            }

            if (totalTime != 0) {
                $("#pio-timeline-current").width(currentTime * 100 / totalTime + "%");
            }
        });

        videoController.listen( "play", function() {
            $("#pio-play-button").attr("class", "fa fa-pause");
            $("#pio-youtube-video").attr("playing", 1);
        });

        videoController.listen( "pause", function() {
            $("#pio-play-button").attr("class", "fa fa-play");
            $("#pio-youtube-video").attr("playing", 0);
        });


        $("#pio-play-button").click(function(){
            var playing = $("#pio-youtube-video").attr("playing");
            if (playing == 1) {
                videoController.pause();
            } else {
                videoController.play();
            }
        });

        $("#pio-mute-button").click(function(){
            console.log("pio click");
            var muting = $("#pio-mute-button").attr("muting");
            if (muting == 1) {
                videoController.unmute();
                $("#pio-mute-button").attr("class", "fa fa-volume-up");
                $("#pio-mute-button").attr("muting", "0");
            } else {
                videoController.mute();
                $("#pio-mute-button").attr("class", "fa fa-volume-off");
                $("#pio-mute-button").attr("muting", "1");
            }
        });
    }
}