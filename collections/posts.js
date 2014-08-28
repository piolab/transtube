 Posts = new Meteor.Collection("posts");

 Meteor.methods({
 	post: function(post){
 		var user = Meteor.user();
 		console.log(user);
 		var duplicatePost = Posts.findOne({videoId: post.videoId});

 		if (!user) {
 			throw new Meteor.Error(401, "You need to login");
 		}
 		// else if (duplicatePost){
 		// 	throw new Meteor.Error(302, "This link has already been posted",duplicatePost._id);
 		// }
 		else{
 			// Initlize post
 			post.submitted = new Date().getTime();
 			post.userId = user._id;

 			var postId = Posts.insert(post);
 			return postId;
 		}
 	}
 });

