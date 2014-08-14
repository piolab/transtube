// need to be refactor
// test a gain
if (Meteor.isClient) {
  Template.tranItem.events({
    'mouseleave .target_word': function(event){
      console.log(' mouse leave ');
      $(event.target).popover('hide');
    },
    'mouseenter .target_word': function (event) {

      console.log("mouse over");
      var keyword = event.target.innerText;
      var TRANSLATE_URL_PREFIX = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyC1ZbsQ4ngsrjM8uMaGQsLF7ZaKfMlDFTY';
      keyword = keyword.toLowerCase();
      var contentShow = '';
      var duolingoHintsUrl = "https://d.duolingo.com/words/hints/en/vi?format=new&sentence="+keyword+"&cache=true&reorder_using_machine_translations=true&is_document_sentence=true&_=1407915454998";
      // var duolingoHintsUrl = "https://d.duolingo.com/words/hints/en/vi?format=new&sentence=get+to+be&cache=true&reorder_using_machine_translations=true&is_document_sentence=true&_=1407986607524";
      $.ajax({
        dataType: 'jsonp',

        // url: TRANSLATE_URL_PREFIX+'&source='+encodeURIComponent('en')+
        // '&target='+encodeURIComponent('vi')+
        // '&q='+encodeURIComponent(keyword),
        //url: 'http://glosbe.com/gapi/translate?from=eng&dest=vie&format=json&phrase='+encodeURIComponent(keyword)+'&pretty=true',
        url: duolingoHintsUrl,
        // cache: true,
        success: function(trans) {
          console.log(keyword);
          console.log(trans);
          // console.log(trans['tokens'][0]['hint_table']['rows']);
          var hintResult = trans['tokens'][0]['hint_table']['rows'];
          for (var i = 0; i<hintResult.length; i++){
            if (i>=4) break;
            console.log(hintResult[i]['cells'][0]);
            contentShow += '<div class="translate-popover">'+hintResult[i]['cells'][0]['hint']+'</div>';
          }
          // For Glosbe
          // for (var i = 0; i<trans['tuc'].length; i++){
          //   if (trans['tuc'][i]['phrase']){
          //     contentShow += '<h4 class="translate-popover">'+trans['tuc'][i]['phrase']['text']+'</h4>';
          //     console.log(trans['tuc'][i]['phrase']['text']);
          //   }
          // }
          var popover = $(event.target).data('bs.popover');
           if (popover === undefined){
            // console.log("nothing to do");
            $(event.target).popover({
              html: true,
              content: contentShow,
              // title: keyword
            }).popover("show");
           }
           else{
            popover.options.content = contentShow;
            popover.options.html = true;
           }
          // var tip = popover.tip();
          // popover.show();
          // $(event.target).popover({
          //   html: true,
          //   content: contentShow,
          //   delay: {show: 200, hide: 100}
          // });
      }

      });
      // need to set boolean here - tried the below code
    }
  });
}
Template.translate.rendered = function(){
  $('#textArea.editable').editable({
    placement: "bottom",
    success: function(response, newValue) {
      alert(newValue);
      console.log(response);
    }});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
