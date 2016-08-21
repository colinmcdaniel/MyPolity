// Colin's Firebase
  // var fff = {
  //   apiKey: "AIzaSyB8TqG5FuYXornV5pOfov-IRbGJH3y-epw",
  //   authDomain: "mypolity-temp.firebaseapp.com",
  //   databaseURL: "https://mypolity-temp.firebaseio.com",
  //   storageBucket: "mypolity-temp.appspot.com",
  // };
  // firebase.initializeApp(fff);

//Gary firebase

// var config = {
//   apiKey: "AIzaSyDo0YPqvSLALkV93436vn8Qj8s1AoBBmow",
//   authDomain: "mypolity-d8c63.firebaseapp.com",
//   databaseURL: "https://mypolity-d8c63.firebaseio.com",
//   storageBucket: "mypolity-d8c63.appspot.com",
// };

// firebase.initializeApp(config);

var openStatesURL = "http://openstates.org/api/v1/"
var openStatesKey = "&apikey=f58d2e11ccbe4471bdb7485c4fee0058"

var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0"

var firebaseUser = firebase.auth().currentUser;
var database = firebase.database();
var userRef = database.ref("usernames");
var representative;

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
var queryURL = "https://newsapi.org/v1/articles?source=cnn&sortByAvailable=latest&apiKey=" +apiKey;

// FUNCTIONS

// This runQuery function expects two parameters (the number of articles to show and the final URL to download data from)
function runQuery(queryURL){

    // The AJAX function uses the URL and Gets the JSON data associated with it. The data then gets stored in the variable called: "NYTData"
     $.ajax({
                url: queryURL,
                method: 'GET',
                success: function(response) {
                console.log(response);
                var results = response.articles;
                $('.slides').empty();
                for (var i = 0; i < 6; i++) {

                    //making div for each article - includes title, image & description
                    var slidesDiv = $('<div class="recentArticles">')

                    //referencing the articles
                    var article = results[i].articles;
                    var articleURL = results[i].url;

                    //references the articles images
                    var articleImg = results[i].urlToImage;

                    //turns the images into buttons <a href = "' +articleURL+ '"></a>'
                    var articleImg = $('<img height="100" width="100" src="' +articleImg+'"</img>');
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
                        slidesToShow: 1,
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

$(document).ready(function() {
  runQuery(queryURL);
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

    $(document).on('click', '#logout-link', function(){

      firebase.auth().signOut().then(function() {
        window.location = 'index.html';
        // Sign-out successful.
      }, function(error) {
        // An error happened.
      });
    });
});
