Meteor.Youtube = {
    getYoutubeUrl : function (youtubeId) {
        return Meteor.PioConstants.YOUTUBE_URL_PREFIX + youtubeId;
    }
}