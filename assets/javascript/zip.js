var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0";
var googleCivicURL = "https://www.googleapis.com/civicinfo/v2/"
var googleCivicKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0";

var sunlightDataApiKey = "f58d2e11ccbe4471bdb7485c4fee0058"
var openStatesURL = "https://openstates.org/api/v1/";
var openStatesKey = "&apikey=" + sunlightDataApiKey;

var openCongressURL = "https://congress.api.sunlightfoundation.com/"
var openCongressKey = "&apikey=" + sunlightDataApiKey;

var divisions;
var offices;
var officeIndices = [];
var officials;
var officialsIndices = [];
var localReps = [];
var representatives = [];

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#profile-link').show();
    $('#logout-link').show();
    $('#login-link').hide();
    $('#home-link').show();
  } else{
    $('#profile-link').hide();
    $('#logout-link').hide();
    $('#login-link').show();
    $('#signup-link').show();
    $('#home-link').hide();
  }
});

$(document).ready(function(){
  var Zip = sessionStorage.getItem('Zip');
  var googleURL = googleGeoURL + Zip + googleGeoKey;
  var googleURL = googleGeoURL + Zip + googleGeoKey;
  $.ajax({
      url: googleURL,
      method: 'GET',
  }).then(function(response){
      data = response.results;
      var City = data[0].address_components[1].long_name;
      var State = data[0].address_components[3].short_name;
      postAddress = data[0].formatted_address;
      postAddress = postAddress.toLowerCase().split(' ').join('+');
      postAddress = postAddress.toLowerCase().split(',').join('');
      postAddress = '?address=' + postAddress;
      var queryOptions = "representatives/";
      var queryURL = googleCivicURL + queryOptions + postAddress + googleCivicKey;

      $.ajax({
          url: queryURL,
          method: 'GET',
      }).then(function(response) {
          divisions = response.divisions;
          offices = response.offices;
          officials = response.officials;

          var includeState = true;
          var includeFed = true;
          for (var divisionKey in divisions) {
              if ((divisionKey.includes("county")) || (divisionKey.includes("place"))){
                  if (divisions[divisionKey].hasOwnProperty("officeIndices")) {
                      officeIndices = officeIndices.concat(divisions[divisionKey].officeIndices);
                  }
              } else {
                  if (includeState || ((divisionKey.includes("state")) && !((divisionKey.includes("sldl")) || (divisionKey.includes("sldu"))))) {
                      if (divisions[divisionKey].hasOwnProperty("officeIndices")) {
                          officeIndices = officeIndices.concat(divisions[divisionKey].officeIndices);
                      }
                  }
              }
          };

          officeIndices.sort(function(a, b){return a-b});

          for (var officeKey in officeIndices) {
              if (offices[officeIndices[officeKey]].hasOwnProperty("officialIndices")) {
                  if (includeFed || (!(offices[officeIndices[officeKey]].name.includes("United States")))) {
                      var officialIndex = offices[officeIndices[officeKey]].officialIndices[0];
                      localReps = localReps.concat([{office: offices[officeIndices[officeKey]], official: officials[officialIndex]}]);
                  }
              }
          }

          for (var rep in localReps) {
              var newRep = {};
              if (localReps[rep].office.divisionId === "ocd-division/country:us") {
                  newRep.level = "federal";
              } else if (localReps[rep].office.divisionId.length == ("ocd-division/country:us/state:" + State.toLowerCase()).length) {
                  if (localReps[rep].office.name.includes("United States")) {
                      newRep.level = "federal";
                  } else {
                      newRep.level = "state";
                  }
              } else if (localReps[rep].office.divisionId.includes("ocd-division/country:us/state:" + State.toLowerCase()+ "/sl")) {
                  newRep.level = "state";
              } else if (localReps[rep].office.divisionId.includes("ocd-division/country:us/state:" + State.toLowerCase()+ "/cd")) {
                  newRep.level = "state";
              } else if (localReps[rep].office.divisionId.includes("county")) {
                  newRep.level = "county";
              } else if (localReps[rep].office.divisionId.includes("place")) {
                  newRep.level = "local";
              } else {
                  newRep.level = "unknown";
              }
              newRep.officeTitle = localReps[rep].office.name;
              if (localReps[rep].office.hasOwnProperty("roles")) {
                  newRep.officeRole = localReps[rep].office.roles;
              } else {
                  newRep.officeRole = "";
              }
              if (localReps[rep].official.hasOwnProperty("party")) {
                  newRep.party = localReps[rep].official.party;
              } else {
                  newRep.party = "";
              }
              newRep.name = localReps[rep].official.name;
              // newRep.party = localReps[rep].official.party;
              var addresses = [];
              for (var i in localReps[rep].official.address) {
                  var temp = localReps[rep].official.address[i].line1;
                  if (localReps[rep].official.address[i].hasOwnProperty("line2")) {
                      temp = temp + ", " + localReps[rep].official.address[i].line2;
                  }
                  if (localReps[rep].official.address[i].hasOwnProperty("line3")) {
                      temp = temp + ", " + localReps[rep].official.address[i].line3;
                  }
                  temp = temp + ", " + localReps[rep].official.address[i].city;
                  temp = temp + ", " + localReps[rep].official.address[i].state;
                  temp = temp + ", " + localReps[rep].official.address[i].zip;
                  addresses.push(temp);
              }
              newRep.addresses = addresses;
              if (localReps[rep].official.hasOwnProperty("phones")) {
                  newRep.phones = localReps[rep].official.phones;
              } else {
                  newRep.phones = [];
              }
              if (localReps[rep].official.hasOwnProperty("emails")) {
                  newRep.emails = localReps[rep].official.emails;
              } else {
                  newRep.emails = [];
              }
              if (localReps[rep].official.hasOwnProperty("channels")) {
                  newRep.channels = localReps[rep].official.channels;
              } else {
                  newRep.channels = [];
              }
              if (localReps[rep].official.hasOwnProperty("urls")) {
                  newRep.urls = localReps[rep].official.urls;
              } else {
                  newRep.urls = [];
              }
              if (localReps[rep].official.hasOwnProperty("photoUrl")) {
                  newRep.photo = localReps[rep].official.photoUrl;
              } else {
                  newRep.photo = [];
              }
              representatives.push(newRep);
              drawRep(newRep);
          }
          getNews(representatives[0].name);
          repInfo(representatives[0].name);
      });
  });
  return false;
});

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
    $('#rep-website').append('<h4><a target="_blank" href="' + rep.urls[m] + '">' + rep.urls[m] + '</a></h4>');
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
        if(response[i].hasOwnProperty('image')){
          var imageURL = response[i].image.thumbnail.contentUrl;
        }
        var headline = response[i].name;
        var description = response[i].description;
        var articleURL = response[i].url;
        var slidesDiv = $('<div class="recentArticles">');
        slidesDiv.attr("class", "slidesDivClass");
        var articleHeadline = $('<h4>');
        var articleDescription = $('<p>');
        var img = $('<img>')
        img.attr('src', imageURL);
        img.attr('class', 'articleImg');
        articleHeadline.text(headline);
        articleDescription.text(description);
        slidesDiv.append(articleHeadline);
        slidesDiv.append(img);
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
