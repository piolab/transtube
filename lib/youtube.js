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

    getYoutubeTranscriptListLink : function(youtubeId, defaultLangCode) {
        return String.format(Meteor.PioConstants.YOUTUBE_TRANSCRIPT_LIST, youtubeId, defaultLangCode);
    },

    getIdFromLink: function(url){
        return url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    },

    getYoutubeCaptionsList: function(youtubeId, hl, callback) {
        hl = "en";
        var link = String.format(Meteor.PioConstants.YOUTUBE_TRANSCRIPT_LIST, youtubeId, hl);

        HTTP.get(link, function(err, response){
            captions = new DOMParser().parseFromString(response.content, "text/xml").getElementsByTagName('track');
            console.log(captions[0]["attributes"]["id"]["value"]);
            var captionArr = [];
            for (var i = 0; i<captions.length; i++){
                var caption = captions[i];
                var captionInfo = {
                    name: caption.getAttribute('name'),
                    lang_code: caption.getAttribute('lang_code'),
                    lang_translated: caption.getAttribute('lang_translated')
                };
                captionArr.push(captionInfo);

            }
            callback(captionArr);             
        });
    },
    getYoutubeCaptions: function(youtubeId, hl, lang_code, name, callback){
        hl = "en";
        var link = String.format(Meteor.PioConstants.YOUTUBE_URL_TRANSCRIPT, youtubeId, name, hl, lang_code);
        console.log(link);

        HTTP.get(link,function(err, response){
            sentences = new DOMParser().parseFromString(response.content, "text/xml").getElementsByTagName('text');
            var sentencesArr = [];
            for (var i = 0; i < sentences.length; i++){

                var text = $('<div/>').html(sentences[i]["innerHTML"]).text(); 
                text = $('<div/>').html(text).text(); 

                var sentence = {
                    text: text,
                    start: sentences[i].getAttribute("start"),
                    dur: sentences[i].getAttribute("dur")
                }
                sentencesArr.push(sentence);
            }
            callback(sentencesArr);
        });  
    },
    getYoutubeData: function(youtubeId, callback){
        
    }
}