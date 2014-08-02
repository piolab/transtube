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

    // Changes XML to JSON
    function xmlToJson(xml) {

        // Create the return object
        var obj = {};

        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    };

    Template.tranItem.rendered = function () {
        var video = Popcorn.youtube('#youtube-video', 'https://www.youtube.com/watch?v=1qL74-K3wuc');
        var currentTrackId;
        var eventDiv = document.getElementById("footnotediv");
        var allTracks = [];
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
              var text = $(this).html().split(/\W+/);;
              len = text.length,
              result = []; 

              for( var i = 0; i < len; i++ ) {
                result[i] = '<span class="target_word" data-toggle="popover" data-trigger="hover" data-placement="bottom">' + text[i] + '</span>';
            }
            $(this).html(result.join(' '));
        });
        }
        function addTranscriptScrollBox(allTracks) {
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

        function addTranscript(jsonObj) {
            var transcript = jsonObj.transcript;
            var tracks = transcript.text;
            console.log(tracks);
            for (var i = 0; i < tracks.length; i++) {
                var text = tracks[i]["#text"];
                var start = parseFloat(tracks[i]["@attributes"].start);
                var dur = parseFloat(tracks[i]["@attributes"].dur);
                var end = start + dur;
                var track = {
                    start: start,
                    end: end,
                    text: text
                }

                allTracks.push(track);

                video.footnote({
                    id: i,
                    start: start,
                    end: end,
                    text: text,
                    target: "footnotediv"
                });
            }
            video.on("trackstart", function(track) {
                console.log(track.id);
                currentTrackId = track.id;
                // Apply the "large" class to the text in event-div
                eventDiv.className = "large";
                // Log the event to the console
                console.log("start!");
                chapters.eq(track.id).addClass('active'); // Set Next Chapter Active
                $('#demo-stage').scrollTo(chScrollPositions[track.id]);

            });

            // listen for the "trackend" event, and execute a function when it is triggered
            video.on("trackend", function() {
                // Apply the "small" class to the text in event-div
                eventDiv.className = "small";
                // Log the event to the console
                console.log("fired!");
            });

            video.on("pause", function() {
                //TODO : cuong
                console.log(currentTrackId);
                var listWords = allTracks[currentTrackId].text.split(/\W+/);
                var xUl = $('.word');

                var TRANSLATE_URL_PREFIX = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyC1ZbsQ4ngsrjM8uMaGQsLF7ZaKfMlDFTY';
                $.each(listWords,function(i,word){

                    $.ajax({
                        dataType: 'jsonp',

                        url: TRANSLATE_URL_PREFIX+'&source='+encodeURIComponent('en')+
                        '&target='+encodeURIComponent('vi')+
                        '&q='+encodeURIComponent(listWords[i]),
                       
                        success: function(trans) {
                            xUl.empty();
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