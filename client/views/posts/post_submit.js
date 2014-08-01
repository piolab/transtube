var youtubeUrlPrefix = function(id){
	// https://gdata.youtube.com/feeds/api/videos/psx-eHmqBvE?v=2&alt=json
	return 'https://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=json';
};
Template.postSubmit.events({
	'submit form': function(e) {
		e.preventDefault();
		var post = {
			url: $(e.target).find('[name=url]').val(),
			// title: $(e.target).find('[name=title]').val(),
			// message: $(e.target).find('[name=message]').val()
		}
		Meteor.call('post',post, function(error,id){
			if (error) {
				throwError(error.reason);
			} else {
				Router.go('postPage', {_id: id});
			}
		})
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
            		thumbnail: responseMedia['media$thumbnail'][3]['url'],
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

