if (Meteor.isClient) {

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
        //var require = Meteor.require;
        var video = Popcorn.youtube('#youtube-video', 'https://www.youtube.com/watch?v=1qL74-K3wuc');
        var eventDiv = document.getElementById("footnotediv");
        var allTracks = [];
        var chScrollPositions = [];
        var chapters = [];

        function addTranscriptScrollBox(allTracks) {
            var tranList = $('#demo-stage').find('ul');
            for (var i = 0; i < allTracks.length; i++) {
                var text = allTracks[i].text;
                var leftHtml = '<div class="left-tran" id= ' + '"sentence' + i + '"' + '>' + text + '</div>';
                var rightHtml = '<div class="right-tran" id= ' + '"transentence' + i + '"' + '>' + text + '</div>';
                var html = '<div class="tran">' + leftHtml + rightHtml + '</div>';
                tranList.append(html);
            }
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
        };

        var jqxhr = $.get( "http://video.google.com/timedtext?lang=en&v=1qL74-K3wuc", function(responseTxt, statusTxt, xhr) {
            console.log( "success" );
            console.log(statusTxt);

            var jsonObj = xmlToJson( responseTxt );
            addTranscript(jsonObj);
            addTranscriptScrollBox(allTracks);
            initChScrollPositions();
            console.log("end");
        })
            .done(function() {
                console.log( "second success" );
            })
            .fail(function() {
                console.log( "error" );
            })
            .always(function() {
                console.log( "finished" );
            });

    }

}