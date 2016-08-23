
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
var representative;
var currentUser = {
  street: '',
  city: '',
  state: '',
  zip: ''
}

var dummyVars = [
  {
    name: 'Bernie \'Feel the Bern\' Sanders',
    title: 'US Senator',
    party: 'Democrat',
    phone: '1-888-555-5555',
    email: 'example@example.com',
    address: '111 School St., Burlington, VT',
    currentProjects: 'Yup'
  },
  {
    name: 'Ted \'I might be the Zodiac\' Cruz',
    title: 'Governor?',
    party: 'Republican',
    phone: '1-999-555-5555',
    email: 'testing@example.com',
    address: 'Texas',
    currentProjects: 'Stuff'
  }
]

var apiKey= "b99e520ffe6d47598d080c2ffafd1b3e";

//for now this will pull up the latest articles
var queryURL = newsApiURL + "articles?source=cnn&sortByAvailable=latest" + newsApiKey;


// FUNCTIONS

function getNews() {
        var params = {
            // Request parameters
            "q": "hilary+clinton", // this is where we need to put in matching representatives for users
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
            console.log(response);
            for(var i = 0; i < response.length; i++){
              
              var headline = response[i].name;
              var thumbnail = response[i].image.thumbnail.contentUrl;
              var description = response[i].description;
              var articleURL = response[i].url;

              var slidesDiv = $('<div class="recentArticles">');
              slidesDiv.attr("class", "slidesDivClass");

              var articleHeadline = $('<h4>');
              var articleThumbnail = $('<img height="120" width="120" src="' + thumbnail + '"</img>');
              var articleDescription = $('<p>');
              articleHeadline.text(headline);
              articleThumbnail.attr('class', 'articleSlides');
              articleDescription.text(description);
              slidesDiv.append(articleHeadline);
              slidesDiv.append(articleThumbnail);
              slidesDiv.append(articleDescription);
              slidesDiv.attr('data-url', articleURL);
              $('.slides').append(slidesDiv);

              $(".slidesDivClass").on("click", function(){
                  var url = $(this).attr('data-url');
                  window.open(url);

              });
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

$(document).ready(function() {
  //if a user is logged in the edit profile fields are filled
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      database.ref('users').child(user.uid).once('value', function(snapshot){
        $('#first-name').val(snapshot.val().firstName);
        $('#last-name').val(snapshot.val().lastName);
        $('#street').val(snapshot.val().street);
        $('#city').val(snapshot.val().city);
        $('#state').val(snapshot.val().state);
        $('#zip').val(snapshot.val().zip);
      });
    $('#edit-profile-submit').on('click', function(){
      database.ref('users').child(user.uid).set({
        firstName: firstName,
        lastName: lastName,
        street: Street,
        city: City,
        state: State,
        zip: Zip,
        lat: response.results[0].geometry.location.lat,
        lng: response.results[0].geometry.location.lng,
        email: email,
      });
    });
    }
  });
  getNews();
  // runQuery(queryURL);
    for(var i = 0; i < dummyVars.length; i++){
      drawTableRow(dummyVars[i]);
    }


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
  });


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
