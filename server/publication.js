Meteor.publish('posts',function(options){
	return Posts.find({},options);
});

Meteor.publish('singlePost',function(id){
	return Posts.find(id);
});

Meteor.publish('captions', function(options){
	return Captions.find({},options);
});

Meteor.publish('postCaptions', function(postId){
	return Captions.find({postId: postId});
});