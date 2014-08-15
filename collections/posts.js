 Posts = new Meteor.Collection("posts");

 Meteor.methods({
 	post: function(post){
 		var user = Meteor.user();
 		var duplicatePost = Posts.findOne({videoId: post.videoId});
 		
 		if (!user) {
 			throw new Meteor.Error(401, "You need to login");
 		}
 		else if (duplicatePost){
 			throw new Meteor.Error(302, "This link has already been posted");
 		}
 		else{
 			// Initlize post
 			post.submited = new Date().getTime();
 			post.userId = user._id;
 			post.author = user.email;

 			var postId = Posts.insert(post);
 			return postId;
 		}
 	}
 });

