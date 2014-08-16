Sentences = new Meteor.Collection("sentences");

Meteor.methods({
	addSentence: function(sentenceInfo){
		var user = Meteor.user();
		if (!user){
			throw new Meteor.Error(401, "You need to login");
		}
		var sentenceId = Sentences.insert(sentenceInfo);
		return sentenceId;
	}
});