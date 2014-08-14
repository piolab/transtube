var getYoutubeTranscriptArray = function (xml, postId) {
    var allTracks = [];
    var jsonObj = PioUtils.JsonUtils.xmlToJson(xml);
    var transcript = jsonObj.transcript;
    var tracks = transcript.text;
    console.log(tracks);
    for (var i = 0; i < tracks.length; i++) {
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


var addTranscriptToSentences = function(xml, videoId, postId, callback){
    var sentences = getYoutubeTranscriptArray(xml, postId);
    for (var i = 0; i<sentences.length; i++){
        Sentences.insert(sentences[i], function(err, id){

        });    
    }
    callback();
}

Template.postSubmit.events({

    'submit form': function(e) {
        Meteor.Youtube.getYoutubeCaptionsList("aD41o3L8tHY", null, function(){
            console.log("CALL BACK");
        });
        e.preventDefault();
        /*
    var url = $(e.target).find('[name=url]').val();
    var videoId = Meteor.Youtube.getIdFromLink(url);
    var post = {
        videoId: videoId[1]
    }

    Meteor.call('post', post, function(error, id) {
        if (error) {
            Errors.throw(error.reason);
        }

        Router.go('tranItem', {_id: id});
    });*/
   //    	var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
   //    	var youtubeUrlApi = Meteor.Youtube.getYutubeUrlPrefix(videoid[1]);
   //    	var jqxhr = $.get(youtubeUrlApi, function(responseTxt, statusTxt, xhr) {
   //    		if (responseTxt){
   //    			var responseMedia = responseTxt['entry']['media$group'];
   //          	// console.log(responseTxt['entry']['media$group']);
   //          	youtubeInfo = {
   //          		thumbnail: Meteor.Youtube.getThumbnailLink(videoid[1]),
   //          		title: responseMedia['media$title']['$t']
   //          	};
   //          	Posts.insert({
   //          		videoId: videoid[1],
   //          		title: youtubeInfo.title,
   //          		videoThumbnail: youtubeInfo.thumbnail,
   //          		// desctiption: desctiption,
   //          		submitted:new Date().getTime()
   //          	},function(err,id){
   //          		var transcriptXmlUrl = Meteor.Youtube.getYoutubeUrlTranscript(videoid[1]);
   //                  console.log(transcriptXmlUrl);
   //                  var jqxhr = $.get( transcriptXmlUrl, function(responseTxt, statusTxt, xhr) {
   //                      addTranscriptToSentences(responseTxt, videoid[1], id, function(){
   //                          Router.go('tranItem', {_id: id});
   //                      });
   //                      console.log("end");
   //                  }).done(function() {
   //                      console.log( "second success" );
   //                  })
   //                  .fail(function() {
   //                      console.log( "error" );
   //                  })
   //                  .always(function() {
   //                      console.log( "finished" );
   //                  });
   //              });

   //          	// console.log(youtubeInfo);
   //          }
   //      });

    },
    'click #youtubeinfo':function(e) {

    throw Error("message");
		// alert('hehe');
		var url = document.getElementById('youtubeurl').value;
        var videoid = Youtube.Meteor.getIdFromLink(url);
		// alert(url);
		// var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
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

