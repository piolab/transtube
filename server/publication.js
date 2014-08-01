Meteor.publish('posts',function(options){
	return Posts.find({},options);
});

Meteor.publish('sentences', function(postId){
	return Setences.find({postId: postId});
});

Meteor.publish('words', function(postId){
	return Words.find({postId: postId});
});
