Template.postItem.helpers({
	domain: function(){
		var self = this;
		var a = document.createElement('a');
		a.href = self.url;
		return a.hostname;
	},
	ownPost: function(){
		return this.userId === Meteor.userId();
	},
	commentsCount: function(){
		return Comments.find({postId: this._id}).count();
	}
});