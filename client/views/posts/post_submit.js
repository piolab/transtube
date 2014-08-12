var getYoutubeTranscriptArray = function (xml, postId) {
    var allTracks = [];
    var jsonObj = PioUtils.JsonUtils.xmlToJson(xml);
    var transcript = jsonObj.transcript;
    var tracks = transcript.text;
    console.log(tracks);
    for (var i = 0; i < tracks.length; i++) {
        // var text = PioUtils.JsonUtils.htmlEntities(tracks[i]["#text"]);
        // var text = PioUtils.JsonUtils.htmlEntities(tracks[i]["#text"]);
        var text = $('<div/>').html(tracks[i]["#text"]).text();
        
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
        // console.log("track "+track.originalText);
        allTracks.push(track);
    }

    return allTracks;
};

// Phien 
var youtubeTranscript = function(xml, videoId, postId){
    var sentences = getYoutubeTranscriptArray(xml, postId);
    for (var i = 0; i<sentences.length; i++){
        Sentences.insert(sentences[i], function(err, id){

        });    
    }
}

Template.postSubmit.events({
  'submit form': function(e) {
   e.preventDefault();
   var url = $(e.target).find('[name=url]').val();
      	// var desctiption = $(e.target).find('[name=desctiption]').val();
      	var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
      	var youtubeUrlApi = Meteor.Youtube.getYutubeUrlPrefix(videoid[1]);
      	var jqxhr = $.get(youtubeUrlApi, function(responseTxt, statusTxt, xhr) {
      		if (responseTxt){
      			var responseMedia = responseTxt['entry']['media$group'];
            	// console.log(responseTxt['entry']['media$group']);
            	youtubeInfo = {
            		thumbnail: Meteor.Youtube.getThumbnailLink(videoid[1]),
            		title: responseMedia['media$title']['$t']
            	};
            	Posts.insert({
            		videoId: videoid[1],
            		title: youtubeInfo.title,
            		videoThumbnail: youtubeInfo.thumbnail,
            		// desctiption: desctiption,
            		submitted:new Date().getTime()
            	},function(err,id){
            		var transcriptXmlUrl = Meteor.Youtube.getYoutubeUrlTranscript(videoid[1]);
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

                    Router.go('tranItem', {_id: id});

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
		var youtubeUrlApi = Meteor.Youtube.getYutubeUrlPrefix(videoid[1]);
		var jqxhr = $.get(youtubeUrlApi, function(responseTxt, statusTxt, xhr) {
			if (responseTxt){
				var responseMedia = responseTxt['entry']['media$group'];
            	// console.log(responseTxt['entry']['media$group']);
            	youtubeInfo = {
            		thumbnail: Meteor.Youtube.getThumbnailLink(videoid[1]),
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

