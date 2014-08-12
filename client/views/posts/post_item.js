
Template.postItem.helpers({
	ownPost: function(){
		return this.userId === Meteor.userId();
	}
	//todos: progress
});

Template.postItem.rendered = function(){
}