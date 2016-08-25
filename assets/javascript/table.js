var representatives = [];

function drawRep(representative){
  var tr = $('<tr>');
  tr.addClass('trRep')
  if(representative.level == 'federal'){
    tr.append($('<td class="text-center">').text(representative.name));
    tr.attr('data-name', representative.name);;
    tr.append($('<td class="text-center">').text(representative.officeTitle));
    tr.append($('<td class="text-center">').text(representative.party));
    if(representative.party == 'Democratic'){
      tr.addClass('info');
    } else if(representative.party == 'Republican'){
      tr.addClass('danger');
    } else{
      tr.addClass('active');
    }
    $('#federal').append(tr);
  }
  if(representative.level == 'state'){
    tr.append($('<td class="text-center">').text(representative.name));
    tr.attr('data-name', representative.name);
    tr.append($('<td class="text-center">').text(representative.officeTitle));
    tr.append($('<td class="text-center">').text(representative.party));
    if(representative.party == 'Democratic'){
      tr.addClass('info');
    } else if(representative.party == 'Republican'){
      tr.addClass('danger');
    } else{
      tr.addClass('active');
    }
    $('#state').append(tr);
  }
  if(representative.level == 'local'){
    tr.append($('<td class="text-center">').text(representative.name));
    tr.attr('data-name', representative.name);
    tr.append($('<td class="text-center">').text(representative.officeTitle));
    tr.append($('<td class="text-center">').text(representative.party));
    if(representative.party == 'Democratic'){
      tr.addClass('info');
    } else if(representative.party == 'Republican'){
      tr.addClass('danger');
    } else{
      tr.addClass('active');
    }
    $('#local').append(tr);
  }
}
function repInfo(representative){
  $('#rep-office').empty();
  $('#rep-phone').empty();
  $('#rep-email').empty();
  $('#rep-website').empty();
  var rep;
  for(var i = 0; i < representatives.length; i++){
    if(representative == representatives[i].name){
      rep = representatives[i];
    }
  }
  $('#rep-name').text(rep.name);
  for(var k = 0; k < rep.addresses.length; k++){
    $('#rep-office').append('<h4>' + rep.addresses[k].replace(/\b[a-z]/g,function(f){return f.toUpperCase();}) + '</h4>');
  }
  for(var j = 0; j < rep.phones.length; j++){
    var phone = rep.phones[j].replace(/\D/g,'');
    $('#rep-phone').append('<h4><a href="tel:' + phone + '">' + rep.phones[j] + '</a></h4>');
  }
  for(var l = 0; l < rep.emails.length; l++){
    $('#rep-email').append('<h4><a href="mailto:' + rep.emails[l] + '">' + rep.emails[l] + '</a></h4>');
  }
  for(var m = 0; m < rep.urls.length; m++){
    $('#rep-website').append('<h4><a href="' + rep.urls[m] + '">' + rep.urls[m] + '</a></h4>');
  }
}


function getNews(query) {
  $('#news').empty();
  $('#news-header').text('Top News About ' + query + ':');
  var params = {
      "q": query,
      "count": "10",
      "offset": "0",
      "mkt": "en-us",
      "safeSearch": "Moderate",
  };
  $.ajax({
      url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params),
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","429642e6b34842d1900847e542179aca");
      },
      type: "GET",
      // Request body
      data: "body",
  }).done(function(data) {
      var response = data.value;
      var div = $('<div class="owl-carousel" id="repNews"></div>');
      for(var i = 0; i < response.length; i++){

        var headline = response[i].name;
        var description = response[i].description;
        var articleURL = response[i].url;
        var slidesDiv = $('<div class="recentArticles">');
        slidesDiv.attr("class", "slidesDivClass");
        var articleHeadline = $('<h4>');
        var articleDescription = $('<p>');
        articleHeadline.text(headline);
        articleDescription.text(description);
        slidesDiv.append(articleHeadline);
        slidesDiv.append(articleDescription);
        slidesDiv.attr('data-url', articleURL);
        div.append(slidesDiv);
        $('#news').append(div);
        $(".slidesDivClass").on("click", function(){
            var url = $(this).attr('data-url');
            window.open(url);
        });
      }
      owl(query);
  })
  .fail(function() {
      console.log('News API Error');
  });
}

function owl(){
  $("#repNews").owlCarousel({
    items : 2,
    itemsCustom : false,
    itemsDesktop : [1199,2],
    itemsDesktopSmall : [980,2],
    itemsTablet: [768,2],
    itemsTabletSmall: false,
    itemsMobile : [479,1],
    singleItem : false,
    itemsScaleUp : false,
    autoPlay : true,
    stopOnHover : false,
    navigation : true,
    navigationText : ["prev","next"],
    rewindNav : true,
    scrollPerPage : false,
  });
}

$(document).on('click', '.trRep', function(){
  var rep = $(this).attr('data-name');
  getNews(rep);
  repInfo(rep);
});

$(document).ready(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      database.ref('users').child(user.uid).child('representatives').once('value', function(snapshot){
        getNews(snapshot.child('0').val().name);
        snapshot.forEach(function(childsnapshot){
          representatives.push(childsnapshot.val());
          drawRep(childsnapshot.val());
        });
        repInfo(snapshot.child('0').val().name);
      });
    } else {
      // No user is signed in.
    }
  });
});
