Meteor.Translate = {
    getGoogleTranslateUrlPrefix : function (apiKey) {
        console.log(apiKey);
        return Meteor.PioConstants.GOOGLE_TRANSLATE_URL_PREFIX + apiKey;
    },
}