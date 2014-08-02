
Template.postItem.helpers({
	ownPost: function(){
		return this.userId === Meteor.userId();
	},
	//todos: progress
});

Template.postItem.rendered = function(){
    $('.editable').editable({
		  success: function(response, newValue) {
		  	// alert(newValue);
		  	alert(this);
		    // <do something with newValue - usually a collection.update call>
		}});
  }