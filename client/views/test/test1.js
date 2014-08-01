if (Meteor.isClient) {
  Template.translate.events({
    'mouseover .target_word': function (event) {
      var keyword = event.target.innerText;
      var TRANSLATE_URL_PREFIX = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyC1ZbsQ4ngsrjM8uMaGQsLF7ZaKfMlDFTY';
      // alert(keyword);
      $.ajax({
        dataType: 'jsonp',

        url: TRANSLATE_URL_PREFIX+'&source='+encodeURIComponent('en')+
            '&target='+encodeURIComponent('vi')+
            '&q='+encodeURIComponent(keyword),

        success: function(trans) {
          // alert(trans.data.translations[0].translatedText);
          console.log($(event.target).attr("class"));
          $(event.target).popover({
            html: true,
            // title: trans.data.translations[0].translatedText,
            content: trans.data.translations[0].translatedText
          });
        }

      });
      // need to set boolean here - tried the below code
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
