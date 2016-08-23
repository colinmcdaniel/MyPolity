
var openStatesURL = "http://openstates.org/api/v1/";
var openStatesKey = "&apikey=f58d2e11ccbe4471bdb7485c4fee0058";

var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0";

var googleCivicURL = "https://www.googleapis.com/civicinfo/v2/"
var googleCivicKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0";

var newsApiURL = "https://newsapi.org/v1/";
var newsApiKey= "&apiKey=b99e520ffe6d47598d080c2ffafd1b3e";


var firebaseUser = firebase.auth().currentUser;
var database = firebase.database();
var userRef = database.ref("usernames");
var mode = "federal";

var representative;
var currentUser = {
  street: '',
  city: '',
  state: '',
  zip: ''
}


//for now this will pull up the latest articles
var queryURL = newsApiURL + "articles?source=cnn&sortByAvailable=latest" + newsApiKey;

// FUNCTIONS

function getNews() {
        var params = {
            // Request parameters
            "q": "microsoft",
            "count": "10",
            "offset": "0",
            "mkt": "en-us",
            "safeSearch": "Moderate",
        };

        $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","20955a84ab464f1db98a498c8e5a8bbd");
            },
            type: "GET",
            // Request body
            data: "{body}",
        }).done(function(data) {
            var response = data.value;
            for(var i = 0; i < response.length; i++){
              var headline = response[i].name;
              var thumbnail = response[i].image.thumbnail.contentUrl;
              var description = response[i].description;
              var slidesDiv = $('<div class="recentArticles">');
              var articleHeadline = $('<h4>');
              var articleThumbnail = $('<img height="120" width="120" src="' + thumbnail + '"</img>');
              var articleDescription = $('<p>');
              articleHeadline.text(headline);
              articleThumbnail.attr('class', 'articleSlides');
              articleDescription.text(description);
              slidesDiv.append(articleHeadline);
              slidesDiv.append(articleThumbnail);
              slidesDiv.append(articleDescription);
              $('.slides').append(slidesDiv);
            }
            $('.slides').slick({
                arrows: true,
                dots: true,
                slidesToShow: 2,
                infinite: true,
                responsive: [
            {
              breakpoint: 992,
                settings: {
                arrows: true,
                dots: true,
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 768,
                settings: {
                arrows: false,
                dots: true,
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            }
          ]
        });

        })
        .fail(function() {
            console.log('News API Error');
        });
    }

function runQuery(queryURL){
  $.ajax({
      url: queryURL,
      method: 'GET',
      success: function(response) {
      console.log(response);
      var results = response.articles;
      $('.slides').empty();
      for (var i = 0; i < 6; i++) {
        //making div for each article - includes title, image & description
        var slidesDiv = $('<div class="recentArticles">');
        slidesDiv.attr('class', 'slidesDivClass');

        //referencing the articles
        var article = results[i].articles;
        var articleURL = results[i].url;

        //references the articles images
        var articleImg = results[i].urlToImage;

        //turns the images into buttons <a href = "' +articleURL+ '"></a>'
        var articleImg = $('<img height="120" width="120" src="' +articleImg+'"</img>');
        articleImg.attr('class', 'articleSlides');

        //getting the articles titles
        var articleTitle = $('<h4>');
        articleTitle.text(results[i].title);

        //getting article description
        var description = $('<p>');
        description.text(results[i].description);
        //appending the title and the image button to the new div
        slidesDiv.append(articleTitle);
        slidesDiv.append(articleImg);
        slidesDiv.append(description);

        //appending our new div into our div class '.slides' on the HTML file
        $('.slides').append(slidesDiv);
      }
      $('.slides').slick({
                        arrows: true,
                        dots: true,
                        slidesToShow: 2,
                        infinite: true,
                        responsive: [
                    {
                      breakpoint: 769,
                        settings: {
                        arrows: false,
                        dots: true,
                        slidesToShow: 1,
                        slidesToScroll: 1
                      }
                    }
                  ]
                });
    }
  });
}

  // {
  //   name: 'Bernie \'Feel the Bern\' Sanders',
  //   title: 'US Senator',
  //   party: 'Democrat',
  //   phone: '1-888-555-5555',
  //   email: 'example@example.com',
  //   address: '111 School St., Burlington, VT',
  //   currentProjects: 'Yup'
  // },
var sunlightDataApiKey = "f58d2e11ccbe4471bdb7485c4fee0058"
var openStatesURL = "https://openstates.org/api/v1/";
var openStatesKey = "/?&apikey=" + sunlightDataApiKey;
var openStatesQuery = "legislators/";

var openCongressURL = "https://congress.api.sunlightfoundation.com/";
var openCongressKey = "&apikey=" + sunlightDataApiKey;
var openCongressQuery = "legislators?bioguide_id="

var federalReps = [];
var stateReps = [];
var localReps = [];

$(document).ready(function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      // var federalReps = [];
      // var stateReps = [];
      // var localReps = [];
      database.ref('users').child(user.uid).once('value', function(snapshot){
        feds = snapshot.val().federalReps;
        states = snapshot.val().stateReps;
        locals = snapshot.val().localReps;
        for (var i = 0; i < feds.length; i++) {
            fedID = feds[i];
            var queryURL = openCongressURL + openCongressQuery + fedID + openCongressKey;
            console.log(queryURL);
            $.ajax({
              url: queryURL,
              method: 'GET',
            }).then(function(ocResponse) {
              var data = ocResponse.results[0];
              var rep = {
                name: data.first_name + " " + data.last_name,
                title: data.chamber,
                party: data.party,
                phone: data.phone,
                email: data.oc_email,
                address: data.office,
                currentProjects: [],
              };
              federalReps.push(rep);
            });
        }
        for (var i = 0; i < states.length; i++) {
            stateID = states[i];
            var queryURL = openStatesURL + openStatesQuery + stateID + openStatesKey;
            console.log(queryURL);
            $.ajax({
              url: queryURL,
              method: 'GET',
            }).then(function(osResponse) {
              var data = osResponse;
              var rep = {
                name: data.full_name,
                title: data.chamber,
                party: data.party,
                phone: data.offices[0].phone,
                email: data.offices[0].email,
                address: data.offices[0].address,
                currentProjects: [],
              };
              stateReps.push(rep);
              console.log(stateReps);
            });
        }

      });
    }
  });

  getNews();
  console.log(mode);
  var reps = [];
  if (mode == "federal") {
    reps = federalReps;
    console.log(federalReps);
    console.log(reps);
  } else if (mode == "state") {
    reps = stateReps;
  } else if (mode == "local") {
    reps = localReps;
  } else {
    reps = [];
  }
  for(var i = 0; i < reps.length; i++){
      drawTableRow(reps[i]);
    }
  });

function drawTableRow(representative){
  var tr = $('<tr>');
  tr.append($('<td class="text-center">').text(representative.name));
  tr.attr('data-name', representative.name);
  tr.addClass('representative');
  tr.append($('<td class="text-center">').text(representative.title));
  tr.append($('<td class="text-center">').text(representative.party));
  tr.append($('<td class="text-center">').append('<a href="tel:' + representative.phone + '">' + representative.phone + '</a><br><a href="mailto:' + representative.email + '">' + representative.email + '</a>'));
  tr.append($('<td class="text-center">').text(representative.currentProjects));
  if(representative.party == 'Democrat'){
    tr.addClass('info');
  } else if(representative.party == 'Republican'){
    tr.addClass('danger')
  }
  $('#table-body').append(tr);
}



//Division input 3 gives you federal level
function getRepresentatives(street,city,state,zip,divisionIndex){

    var streetArr = street.split(" ");
    var cityArr = city.split(" ");
    var stateArr = state.split(" ");
    var zipArr = zip.split(" ");

    var streetStr = streetArr[0];
    for(var i=1;i<streetArr.length;i++)
        streetStr += "+"+streetArr[i];

    var cityArr = city.split(" ");
    var cityStr = cityArr[0];
    for(var i=1;i<cityArr.length;i++)
        cityStr += "+"+cityArr[i];

    var stateArr = state.split(" ");
    var stateStr = stateArr[0];
    for(var i=1;i<stateArr.length;i++)
        stateStr += "+"+stateArr[i];

    // Google Civic API
    var baseURL =  "https://www.googleapis.com/civicinfo/v2/representatives?";
    var address = "address=" +streetStr+ "%2C+"+cityArr+ "%2C+" +stateArr+ "+" +zip;
    var apiKey = "&key=AIzaSyAGOn6GB2DgRCJcXoVc_48c09LmbL7l_pk";
    var queryURLtest = baseURL + address + apiKey;

    $.ajax({
        url: queryURLtest,
        method: 'GET'
    })
    .done(function(response) {

        var division = Object.keys(response.divisions)[divisionIndex];

        console.log("FEDERAL:");
        console.log("");

        var officeIndices = response.divisions[division].officeIndices;
        for(var i=0;i<officeIndices.length;i++){

            var officialIndices = response.offices[officeIndices[i]].officialIndices;
            for(var j=0;j<officialIndices.length;j++){

                console.log("Name: " + response.officials[officialIndices[j]].name);
                console.log("Title: " + response.offices[officeIndices[i]].name);
                for(var t=0;t<response.offices[officeIndices[i]].roles.length;t++)
                    console.log("Role "+ (t+1) +": "+ response.offices[officeIndices[i]].roles[t]);
                console.log("Party: " + response.officials[officialIndices[j]].party);
                for(var t=0;t<response.officials[officialIndices[j]].phones.length;t++)
                            console.log("Phone "+ (t+1) +": "+ response.officials[officialIndices[j]].phones[t]);
                for(var t=0;t<response.officials[officialIndices[j]].address.length;t++){
                    console.log("Address "+ (t+1) +":");
                    console.log(response.officials[officialIndices[j]].address[t].line1);
                    console.log(response.officials[officialIndices[j]].address[t].line2);
                    console.log(response.officials[officialIndices[j]].address[t].city +", "+ response.officials[officialIndices[j]].address[t].state +" "+ response.officials[officialIndices[j]].address[t].zip);
                }
                for(var t=0;t<response.officials[officialIndices[j]].channels.length;t++)
                    console.log("Social media "+ (t+1) +": "+ response.officials[officialIndices[j]].channels[t].id +" ("+ response.officials[officialIndices[j]].channels[t].type +")");
                for(var t=0;t<response.officials[officialIndices[j]].urls.length;t++)
                    console.log("Website "+ (t+1) +": "+ response.officials[officialIndices[j]].urls[t]);
                console.log("Photo URL: " + response.officials[officialIndices[j]].photoUrl);
                console.log("");
            }
        }
    });
}

$(document).on('click', '#logout-link', function(){

  firebase.auth().signOut().then(function() {
    window.location = 'index.html';
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
});
