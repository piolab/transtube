var youtubeUrlPrefix = function(id){
	// https://gdata.youtube.com/feeds/api/videos/psx-eHmqBvE?v=2&alt=json
	return 'https://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=json';
};
var thumbnailLink = function(id){
	return 'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg'
};
// Phien 
var youtubeTranscript = function(videoId, postId){
	//return this
	sentencesObject = {
		start:'',
		end: '',
		postId: postId,
		order: '',
		originalText:'',
		transText: []
	};
	return sentencesObject;
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
            		
            		// Phien
            		sentencesObject = youtubeTranscript(videoid[1], id);
            		Sentences.insert(sentencesObject,function(err,id){
            			alert(err);
            		});
            		Router.go('postPage', {_id: id});
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

