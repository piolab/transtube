Template.sentenceItem.rendered = function () {
    function initEditable() {
		$('.editable').editable({
            success: function(response, newValue) {
                var id = $(this).attr("sentence_id");
                Sentences.update(id,{$push:{transText:newValue}});
            }
        });
    }

    initEditable();
}

Template.sentenceItem.helpers ({
	translateText : function() {
		var trans = this.transText;
		if (trans.length > 0) {
			return trans[trans.length - 1];
		}
		return Meteor.PioConstants.UNTRAN_TEXT_MESSAGE;
	},
	originalText1: function() {
		return this.originalText+' ';
	}
})