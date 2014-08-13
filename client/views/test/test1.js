// need to be refactor
// test a gain
if (Meteor.isClient) {
  Template.tranItem.events({
    'mouseleave .target_word': function(event){
      $(event.target).popover('hide');
    },
    'mouseover .target_word': function (event) {
      var keyword = event.target.innerText;
      var TRANSLATE_URL_PREFIX = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyC1ZbsQ4ngsrjM8uMaGQsLF7ZaKfMlDFTY';
      keyword = keyword.toLowerCase();
      var contentShow = '';
      $.ajax({
        dataType: 'jsonp',

        // url: TRANSLATE_URL_PREFIX+'&source='+encodeURIComponent('en')+
        // '&target='+encodeURIComponent('vi')+
        // '&q='+encodeURIComponent(keyword),
        url: 'http://glosbe.com/gapi/translate?from=eng&dest=vie&format=json&phrase='+encodeURIComponent(keyword)+'&pretty=true',
        // cache: true,
        success: function(trans) {

          console.log(trans['tuc'].length);
          for (var i = 0; i<trans['tuc'].length; i++){
            if (trans['tuc'][i]['phrase']){
              contentShow += '<h4 class="translate-popover">'+trans['tuc'][i]['phrase']['text']+'</h4>';
              // console.log(trans['tuc'][i]['phrase']['text']);
            }
          }
          
          $(event.target).popover({
            html: true,
            content: contentShow
          }).popover('show');
        }

      });
      // need to set boolean here - tried the below code
    }
  });
Template.translate.rendered = function(){
  $('#textArea.editable').editable({
    placement: "bottom",
    success: function(response, newValue) {
      alert(newValue);
      console.log(response);
    }});
  $('p').each(function(){

    var tagRE = /([^<]*)(<(?:\"[^\"]*\"|'[^']*'|[^>'\"]*)*>)([^<]*)/g,
    match,
    result = [],
    i = 0;

    while(match = tagRE.exec($(this).html())) {
      var text1 = match[1].split(/\s+/),
      len1 = text1.length;

      var text2 = match[3].split(/\s+/),
      len2 = text2.length;
      
      for(var tIdx = 0; tIdx < len1; tIdx++ ) 
        result[i++] = '<span class="target_word" data-toggle="popover" data-trigger="hover" data-placement="bottom">' + text1[tIdx] + '</span>';            
      
      result[i++] = match[2];
      
      for(var tIdx = 0; tIdx < len2; tIdx++ ) 
        result[i++] = '<span class="target_word" data-toggle="popover" data-trigger="hover" data-placement="bottom">' + text2[tIdx] + '</span>';           
    }

    $(this).html(result.join(' '));

  });    
}
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
