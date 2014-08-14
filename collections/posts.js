 Posts = new Meteor.Collection("posts");

 Meteor.methods({
 	post: function(post){
 		var user = Meteor.user();
 		var duplicatePost = Posts.findOne({videoId: post.videoId});
 		console.log(post.videoId);
 		if (!user) {
 			throw new Meteor.Error(401, "You need to login");
 		}
 		else if (!post.videoId){
 			throw new Meteor.Error(302, "Can not get video Id from your Link");
 		}
 		// else if (duplicatePost){
 		// 	throw new Meteor.Error(302, "This link has already been posted");
 		// }
 		else{
 			// Initlize post
 			post.submited = new Date().getTime();
 			post.author = user._id;
 			
 			var youtubeUrlApi = Meteor.Youtube.getYutubeUrlPrefix(post.videoId);
 			HTTP.call("GET",youtubeUrlApi,function(response, status, xhr) {
 				console.log(response);
 				if (response){
 					post.thumbnail = Meteor.Youtube.getThumbnailLink(post.videoId);
 					post.title = response['entry']['media$group']['media$title']['$t'];
 					Posts.insert(post,function(err, id){
 					if (err){
 						throw new Meteor.Error(err.reason);
 					}
 				});
 				}
 				
 			});

 			
 		}
 	}
 });

