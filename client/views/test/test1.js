if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to tubelearning.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

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

  // Template.carpool_event.events({
  //   /**
  //    * Take Event Handler
  //    */
  //   "click .takeEvent": function () {
  //      Session.set("selected_carpool_event", this._id);
       
  //          console.log("Take event:"+this._id);
       
  //   }
  // });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
