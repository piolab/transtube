Meteor.publish('posts',function(options){
	return Posts.find({},options);
});

Meteor.publish('sentences', function(){
	return Sentences.find();
});

Meteor.publish('words', function(postId){
	return Words.find({postId: postId});
});
