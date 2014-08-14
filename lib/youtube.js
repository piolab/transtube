Meteor.Youtube = {
    /**
     *
     * @param youtubeId: Youtube id
     * @returns string: Youtube URL
     */
    getYoutubeUrl : function (youtubeId) {
        return Meteor.PioConstants.YOUTUBE_URL_PREFIX + youtubeId;
    },

    /**
     *
     * @param youtubeId: Youtube id
     * @returns string: Youtube URL Prefix
     */
    getYutubeUrlPrefix : function(youtubeId){
        console.log(Meteor.PioConstants.YOUTUBE_URL_API);
        console.log(String.format);
        console.log(youtubeId);
        return String.format(Meteor.PioConstants.YOUTUBE_URL_API, youtubeId);
    },

    /**
     *
     * @param youtubeId: Youtube id
     * @returns string: Youtube transcript url
     */
    getYoutubeUrlTranscript : function(youtubeId) {
        return Meteor.PioConstants.YOUTUBE_URL_TRANSCRIPT + youtubeId;
    },

    /**
     *
     * @param youtubeId: Youtube id
     * @returns string: Youtube: thumbnail url
     */
    getThumbnailLink : function(youtubeId){
        return String.format(Meteor.PioConstants.YOUTUBE_THUMB_TEMPLATE, youtubeId);
    },
    getIdFromLink: function(url){
        return url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    }
}