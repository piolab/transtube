Captions = new Meteor.Collection("captions");

 Meteor.methods({
 	addCaption: function(captionInfo){
 		var captionId = Captions.insert(captionInfo);
 		return captionId;
 	}
 });

