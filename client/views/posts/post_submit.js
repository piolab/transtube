addCaptionToPost = function(videoId, postId, captionInfo, isStandard, isTrust, callback){
    captionInfo.isTrust = isTrust,
    captionInfo.isStandard = isStandard;
    captionInfo.postId = postId;
    captionInfo.videoId = videoId;
    Meteor.call('addCaption', captionInfo, function(error, captionId){
        Meteor.Youtube.getYoutubeCaptions(videoId, null, captionInfo, function(sentences){
            for (var i = 0; i<sentences.length; i++){
                addSentenceToCaption(captionId, sentences[i], i);
            }
            callback();
        })
    });
}

addSentenceToCaption = function(captionId, sentenceInfo, order){
    sentenceInfo.order = order;
    sentenceInfo.captionId = captionId;
    Sentences.insert(sentenceInfo);
}

Template.postSubmit.events({
    'submit form': function(e) {
        e.preventDefault();
        Meteor.Youtube.getYoutubeData("aD41o3L8tHY",function(){

        });
        
        var url = $(e.target).find('[name=url]').val();
        var videoId = Meteor.Youtube.getIdFromLink(url);
        if (!videoId){
            Errors.throw("Can not get video id from your link");
            return;
        }
        // Get caption list
        Meteor.Youtube.getYoutubeCaptionsList(videoId, null, function(captionList){
            console.log(captionList);
            // Check if not caption list exist
            if (captionList.length === 0){
                Errors.throw("There are no captions in this video");
            }


            // If exist captions
            else{
                Meteor.Youtube.getYoutubeData(videoId, function(youtubeData){
                    console.log(youtubeData);
                    //youtubeData.captions = captionList;
                    // Post youtube Data
                    Meteor.call('post', youtubeData, function(error, postId){
                        
                        if (error){
                            Errors.throw(error.reason);
                            // Router.go('tranItem',{_id:error.details});
                        }
                        else {
                            for (var i = 0; i< captionList.length; i++){
                                var captionId = addCaptionToPost(videoId, postId, captionList[i], true, true, function(){
                                    Router.go('tranItem',{_id:postId});
                                });
                            }
                        }
                    });
                });
            }
            
        });
        

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

