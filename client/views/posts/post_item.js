
Template.postItem.helpers({
	ownPost: function(){
		return this.userId === Meteor.userId();
	},
	sqThumbnail: function() {
		return this.thumbnail[1]["url"];
	}
	//todos: progress
});

Template.postItem.rendered = function(){
    $('.editable').editable({
		  success: function(response, newValue) {
		  	alert(this);
		}});
  }