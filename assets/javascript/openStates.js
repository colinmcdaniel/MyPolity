// Colin's Firebase
  // var fff = {
  //   apiKey: "AIzaSyB8TqG5FuYXornV5pOfov-IRbGJH3y-epw",
  //   authDomain: "mypolity-temp.firebaseapp.com",
  //   databaseURL: "https://mypolity-temp.firebaseio.com",
  //   storageBucket: "mypolity-temp.appspot.com",
  // };
  // firebase.initializeApp(fff);

// Spencer's Firebase
var config = {
apiKey: "AIzaSyA6P8YWzzxROrGRStOxa1kEFbDau5SVzW8",
authDomain: "mypolity-4808b.firebaseapp.com",
databaseURL: "https://mypolity-4808b.firebaseio.com",
storageBucket: "mypolity-4808b.appspot.com",
};

firebase.initializeApp(config);


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

// Division 3 gives you US information
getRepresentatives("10824 Lindbrook Drive","Los Angeles","California","90024",3);


var apiKey= "b99e520ffe6d47598d080c2ffafd1b3e";


//for now this will pull up the latest articles
var queryURL = "https://newsapi.org/v1/articles?source=cnn&sortByAvailable=latest&apiKey=" +apiKey;

// FUNCTIONS

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


$(document).on('click', '#submit-button', function() {
    var firstName = $('#first-name').val();
    var lastName = $('#last-name').val();
    var Street = $('#street').val().trim();
    var City = $('#city').val().trim();
    var State = $('#state').val();
    var Zip = $('#zip').val().trim();
    var email = $('#email').val();
    var pass = $('#pwd').val();
    var postAddress = Street.toLowerCase().split(' ').join('+');
    postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
    postAddress += "+" + Zip;
    var topic = 'metadata/ca';
    // var queryURL = siteURL + topic + "/?" + "&apikey=" + APIkey;

    // var queryURL = googleGeoURL + postAddress + googleGeoKey;
    // var user = {
    //     firstName: firstName,
    //     lastName: lastName,
    //     street: Street,
    //     city: City,
    //     state: State,
    //     zip: Zip,
    //     email: email,
    // };

    // $.ajax({
    //         url: queryURL,
    //         method: 'GET'
    //     })
    //     .then(function(response) {
    //         console.log(response);
    //     }).then(function(result) {

    //     });



    //creat firebase auth account
    // sfirebase.auth().createUserWithEmailAndPassword(user.email, pass).catch(function(error) {
    // Handle Errors here.
    // console.log('Error');
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // $('#modalText').text(error.message);
    // $('#myModal').show();
    // });

    // $('#modalClose').on('click', function(){
    //   $('#myModal').hide();
    // });

    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     window.location = 'federal.html';
    //   }
    // });
    return false;
});




$(document).on('click', '#login-button', function(){

  var email = $('#login-email').val();
  var pass = $('#login-pass').val();

  firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  $('#modalText').text(error.message);
  $('#myModal').show();
  });

  $('#modalClose').on('click', function(){
    $('#myModal').hide();
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.location = 'federal.html';
    }
  });
  return false;
});

$(document).on('click', '#logout-link', function(){

  firebase.auth().signOut().then(function() {
    window.location = 'index.html';
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('#login-link').css('display', 'none');
    $('#logout-link').css('display', 'block');
    user.providerData.forEach(function (profile) {
    console.log("Sign-in provider: "+profile.providerId);
    console.log("  Provider-specific UID: "+profile.uid);
    console.log("  Name: "+profile.displayName);
    console.log("  Email: "+profile.email);
    console.log("  Photo URL: "+profile.photoURL);
  });
  } else {
    $('#logout-link').css('display', 'none');
    $('#login-link').css('display', 'block');
    $('#sign-up').show();
  }
});

                    //this makes our slick track clickable and opens the article page in a new tab
                    $(".slidesDivClass").click(function() {

                      window.preventDefault;
                      window.open(articleURL, '_blank');

                    });
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
  firebase.auth().onAuthStateChanged(function(user) {
    database.ref('users').child(user.uid).once('value', function(snapshot){
      currentUser.street = snapshot.val().street;
      currentUser.city = snapshot.val().city;
      currentUser.state = snapshot.val().state;
      currentUser.zip = snapshot.val().zip;
    });


    $("#federal-link").on("click",function(){
        for(var i = 0; i < dummyVars.length; i++){
          drawTableRow(dummyVars[i]);
        }
    });

    console.log(currentUser);
  });
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
        console.log(division)

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
