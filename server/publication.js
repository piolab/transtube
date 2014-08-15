Meteor.publish('posts',function(options){
	return Posts.find({},options);
});

Meteor.publish('sentences', function(options){
	return Sentences.find({}, options);
});

Meteor.publish('captions', function(options){
	return Captions.find({},options);
});

Meteor.publish('words', function(postId){
	return Words.find({postId: postId});
});
