var youtubeUrlPrefix = function(id){
	// https://gdata.youtube.com/feeds/api/videos/psx-eHmqBvE?v=2&alt=json
	return 'https://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=json';
};

var youtubeUrlTranscript = function(id) {
    return 'http://video.google.com/timedtext?lang=en&v=' + id;
}

var thumbnailLink = function(id){
	return 'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg'
};

// Changes XML to JSON
var xmlToJson = function (xml) {

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

var getYoutubeTranscriptArray = function (xml, postId) {
    var allTracks = [];
    var jsonObj = xmlToJson(xml);
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
            postId: postId,
            order: i,
            originalText: text,
            transText: []
        }

        allTracks.push(track);
    }

    return allTracks;
};

// Phien 
var youtubeTranscript = function(xml, videoId, postId){


    var sentences = getYoutubeTranscriptArray(xml, postId);

	Sentences.insert(sentences, function(err, id){

	});

	return sentences;
}

	Template.postSubmit.events({
		'submit form': function(e) {
			e.preventDefault();
			var url = $(e.target).find('[name=url]').val();
      	// var desctiption = $(e.target).find('[name=desctiption]').val();
      	var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
      	var youtubeUrlApi = youtubeUrlPrefix(videoid[1]);
      	var jqxhr = $.get(youtubeUrlApi, function(responseTxt, statusTxt, xhr) {
      		if (responseTxt){
      			var responseMedia = responseTxt['entry']['media$group'];
            	// console.log(responseTxt['entry']['media$group']);
            	youtubeInfo = {
            		thumbnail: thumbnailLink(videoid[1]),
            		title: responseMedia['media$title']['$t']
            	};
            	Posts.insert({
            		videoId: videoid[1],
            		title: youtubeInfo.title,
            		videoThumbnail: youtubeInfo.thumbnail,
            		// desctiption: desctiption,
            		submitted:new Date().getTime()
            	},function(err,id){
            		var transcriptXmlUrl = youtubeUrlTranscript(videoid[1]);
                    console.log(transcriptXmlUrl);
                    var jqxhr = $.get( transcriptXmlUrl, function(responseTxt, statusTxt, xhr) {
                        console.log( "success" );
                        console.log(statusTxt);
                        console.log(responseTxt);
                        youtubeTranscript(responseTxt, videoid[1], id);
                        console.log("end");
                    }).done(function() {
                        console.log( "second success" );
                    })
                    .fail(function() {
                        console.log( "error" );
                    })
                    .always(function() {
                        console.log( "finished" );
                    });

            	});
            	
            	// console.log(youtubeInfo);
            }
        });
      },
      'click #youtubeinfo':function(e) {
		// alert('hehe');
		var url = document.getElementById('youtubeurl').value;
		// alert(url);
		var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
		var youtubeUrlApi = youtubeUrlPrefix(videoid[1]);
		var jqxhr = $.get(youtubeUrlApi, function(responseTxt, statusTxt, xhr) {
			if (responseTxt){
				var responseMedia = responseTxt['entry']['media$group'];
            	// console.log(responseTxt['entry']['media$group']);
            	youtubeInfo = {
            		thumbnail: thumbnailLink(videoid[1]),
            		title: responseMedia['media$title']['$t']
            	};
            	Posts.insert({
            		videoId: videoid[1],
            		title: youtubeInfo.title,
            		videoThumbnail: youtubeInfo.thumbnail
            	});
            	console.log(youtubeInfo);
            }
        });
	}

});

