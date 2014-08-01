
Template.postItem.helpers({
	ownPost: function(){
		return this.userId === Meteor.userId();
	},
	//todos: progress
});

Template.postItem.rendered = function(){
    $('.editable').editable({
      placement: "auto bottom",
      success: function(response, newValue) {
        alert(newValue);
        console.log(response);
    // <do something with newValue - usually a collection.update call>
  	}});
  }