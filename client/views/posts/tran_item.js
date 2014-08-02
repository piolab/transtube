if (Meteor.isClient) {
    // console.log();
    $.fn.scrollTo = function( target, options, callback ){
        if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
        var settings = $.extend({
            scrollTarget  : target,
            offsetTop     : 50,
            duration      : 500,
            easing        : 'swing'
        }, options);
        return this.each(function(){
            var scrollPane = $(this);
            var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
            var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
            scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
                if (typeof callback == 'function') { callback.call(this); }
            });
        });
    }

    function getYoutubeUrl(youtubeId) {
        return "https://www.youtube.com/watch?v=" + youtubeId;
    }

    Template.tranItem.rendered = function () {
        var yotubeUrl = getYoutubeUrl(this.data.post.videoId);
        var video = Popcorn.youtube('#youtube-video', yotubeUrl);
        var currentTrackOrder = -1;
        var eventDiv = document.getElementById("footnotediv");
        var allTracks = this.data.sentences;
        var chScrollPositions = [];
        var chapters = [];

        function initEditable() {
            $('.editable').editable({
                success: function(response, newValue) {
                    alert($(this).attr("sentence_id"));
                }
            });
        }

        function initTranlatable() {
            $('.left-tran').each(function(){
              var text = $(this).html().split(/\b\s+(?!$)/);
              len = text.length,
              result = []; 

              for( var i = 0; i < len; i++ ) {
                result[i] = '<span class="target_word" data-toggle="popover" data-trigger="hover" data-placement="bottom">' + text[i] + '</span>';
            }
            $(this).html(result.join(' '));
        });
        }
        function addTranscriptScrollBox() {
            var tranList = $('#demo-stage').find('ul');
            for (var i = 0; i < allTracks.length; i++) {
                var id = allTracks[i]._id;
                var text = allTracks[i].originalText;
                var trans = allTracks[i].transText[0]?allTracks[i].transText[0]:"";
                var leftHtml = '<div class="left-tran" sentence_id= ' + '"' + id + '"' + '>' + text + '</div>';
                var rightHtml = '<span class="editable right-tran" data-placement="bottom" data-type="textarea" sentence_id= ' + '"' + id + '"' + '>' + trans + '</span>';
                var html = '<div class="tran">' + leftHtml + rightHtml + '</div>';
                tranList.append(html);
            }

            initEditable();
            initTranlatable();
        }

        function initChScrollPositions() {
            chapters = $('#demo-stage').find('ul').children('div');
            console.log(chapters.length);
            chapters.each(function(i){
                chScrollPositions[i] = Math.round($(this).offset().top - $('#demo-stage').offset().top) - 10;
            });

        }

        function addTranscript() {
            for (var i = 0; i < allTracks.length; i++) {
                var track = allTracks[i];
                video.footnote({
                    order: track.order,
                    start: track.start,
                    end: track.end,
                    text: track.originalText,
                    target: "footnotediv"
                })
            }

            video.on("trackstart", function(track) {
                console.log(track.order);
                currentTrackOrder = track.order;
                // Apply the "large" class to the text in event-div
                eventDiv.className = "large";
                // Log the event to the console
                console.log("start!");
                chapters.eq(track.order).addClass('active'); // Set Next Chapter Active
                $('#demo-stage').scrollTo(chScrollPositions[track.order]);

            });

            // listen for the "trackend" event, and execute a function when it is triggered
            video.on("trackend", function() {
                // Apply the "small" class to the text in event-div
                eventDiv.className = "small";
                // Log the event to the console
                console.log("fired!");
            });

            video.on("pause", function() {
                console.log(currentTrackOrder);
                var listWords = allTracks[currentTrackOrder].originalText.split(/\W+/);
                var xUl = $('.word');
                xUl.empty();
                var TRANSLATE_URL_PREFIX = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyC1ZbsQ4ngsrjM8uMaGQsLF7ZaKfMlDFTY';
                $.each(listWords,function(i,word){

                    $.ajax({
                        dataType: 'jsonp',

                        url: TRANSLATE_URL_PREFIX+'&source='+encodeURIComponent('en')+
                        '&target='+encodeURIComponent('vi')+
                        '&q='+encodeURIComponent(listWords[i]),
                       
                        success: function(trans) {

                            xUl.append('<li class="list-group-item">'+word+'     <=>        '+trans.data.translations[0].translatedText +'</li>');
                        }

                    });
                });

                console.log(listWords);

            });
        };

        console.log("addTrans");
        addTranscript();
        console.log("addScrollBox");
        addTranscriptScrollBox();
        console.log("initCh");
        initChScrollPositions();

    }

}