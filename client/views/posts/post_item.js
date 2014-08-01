
Template.postItem.helpers({
	ownPost: function(){
		return this.userId === Meteor.userId();
	},
	options: function () {
		return {
			type: 'textarea',
			async: true,
			position: 'bottom',
			value: this.title,
			onsubmit: function (val, cb) {
				alert(this.params.id);
				Posts.update({title:this.title},{$set:{title:cb}},function(err){
					if (err){

					}
					else {
						// value = val;
					}
				});
			}
		};
	}
	//todos: progress
});
