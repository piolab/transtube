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
    getYoutubeApiUrl : function(youtubeId){
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
        var result = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if (result){
            return result[1]
        }
        else return null;
    },

    getYoutubeCaptionsList: function(youtubeId, hl, callback) {
        hl = "en";
        var link = String.format(Meteor.PioConstants.YOUTUBE_TRANSCRIPT_LIST, youtubeId, hl);

        HTTP.get(link, function(err, response){
            captions = new DOMParser().parseFromString(response.content, "text/xml").getElementsByTagName('track');
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
    getYoutubeCaptions: function(youtubeId, hl, captionInfo, callback){
        hl = "en";
        var link = String.format(Meteor.PioConstants.YOUTUBE_URL_TRANSCRIPT, youtubeId, captionInfo.name, hl, captionInfo.lang_code);
        console.log(link);

        HTTP.get(link,function(err, response){
            sentences = new DOMParser().parseFromString(response.content, "text/xml").getElementsByTagName('text');
            var sentencesArr = [];
            for (var i = 0; i < sentences.length; i++){

                var text = $('<div/>').html(sentences[i]["innerHTML"]).text(); 
                text = $('<div/>').html(text).text(); 
                var start = parseFloat(sentences[i].getAttribute("start"));
                var dur =  parseFloat(sentences[i].getAttribute("dur"));
                var end = start + dur;
                var sentence = {
                    text: [text],
                    start: start,
                    end: end
                }
                sentencesArr.push(sentence);
            }
            callback(sentencesArr);
        });  
    },
    getYoutubeData: function(youtubeId, callback){
        var link = this.getYoutubeApiUrl(youtubeId) + "&fields=title,media:group(media:player,media:thumbnail,media:content)";
        console.log(link);
        HTTP.get(link,function(err, response){
            console.log(response["data"]["entry"]);
            var resData = response["data"]["entry"];
            var youtubeData = {
                videoId: youtubeId,
                title: resData["title"]["$t"],
                thumbnail: resData["media$group"]["media$thumbnail"],
                duration: resData["media$group"]["media$content"][0]["duration"]
            };
            callback(youtubeData);
        });  
    }
}