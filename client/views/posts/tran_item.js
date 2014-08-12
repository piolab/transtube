Template.tranItem.rendered = function () {
    Meteor.JqueryFunction.initScrollTo();
    var yotubeUrl = Meteor.Youtube.getYoutubeUrl(this.data.post.videoId);
    var video = Popcorn.youtube('#youtube-video', yotubeUrl);
    var currentTrackOrder = -1;
    var eventDiv = document.getElementById("footnotediv");
    var allTracks = this.data.sentences;
    var chScrollPositions = [];
    var chapters = [];

    function initTranlatable() {
        // $('.left-tran').each(function(){
        //   var text = $(this).html().split(' ');
        //   len = text.length,
        //   result = [];

        //   for( var i = 0; i < len; i++ ) {
        //     result[i] = '<span class="target_word" data-toggle="popover" data-trigger="hover" data-placement="bottom">' + text[i] + '</span>';
        // }
        // $(this).html(result.join(' '));
        // });
    }
    function addTranscriptScrollBox() {
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

        video.on("pause", function() {
            if (currentTrackOrder == -1) {
                return;
            }
            console.log(currentTrackOrder);
            var listWords = allTracks[currentTrackOrder].originalText.split(/\W+/);
            var xUl = $('.word');
            xUl.empty();
            var apiKey = Config.GoogleApi.TranslateKey[Config.DevStatus];
            var translateUrlPrefix = Meteor.Translate.getGoogleTranslateUrlPrefix(apiKey);
            $.each(listWords,function(i,word){

                $.ajax({
                    dataType: 'jsonp',

                    url: translateUrlPrefix+'&source='+encodeURIComponent('en')+
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

    addTranscript();
    addTranscriptScrollBox();
    initChScrollPositions();

}

Template.tranItem.helpers ({
    sentences: function() {
        var sens = Sentences.find({postId:Session.get("post_id")}, {sort: {order: 1}}).fetch();
        return sens;
    }
})