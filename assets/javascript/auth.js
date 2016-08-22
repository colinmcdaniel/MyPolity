var firebaseUser = firebase.auth().currentUser;
var database = firebase.database();
var userRef = database.ref("usernames");

var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0";

var sunlightDataApiKey = "f58d2e11ccbe4471bdb7485c4fee0058"
var openStatesURL = "http://openstates.org/api/v1/";
var openStatesKey = "&apikey=" + sunlightDataApiKey;

var openCongressURL = "https://congress.api.sunlightfoundation.com/"
var openCongressKey = "&apikey=" + sunlightDataApiKey;


$(document).on('click', '#submit-button', function() {
  var firstName = $('#first-name').val();
  var lastName = $('#last-name').val();
  var Street = $('#street').val().trim();
  var City = $('#city').val().trim();
  var State = $('#state').val();
  var Zip = $('#zip').val().trim();
  var email = $('#email').val();
  var pass = $('#pwd').val();
  var confirmPass = $('#confirm-pwd').val();

  var postAddress = Street.toLowerCase().split(' ').join('+');
  postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
  postAddress += "+" + Zip;

  var queryURL = googleGeoURL + postAddress + googleGeoKey;
  console.log(pass, confirmPass);
  if(pass == confirmPass){
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(geoResponse) {
      console.log(geoResponse);
      user.latitude = geoResponse.results[0].geometry.location.lat;
      user.longitude = geoResponse.results[0].geometry.location.lng;
      var openCongressQuery = "legistrators/locate?latitude=" + user.latitude;
      openCongressQuery += "&longitude=" + user.longitude
      var queryURL = openCongressURL + openCongressQuery + openCongressKey;
      console.log(queryURL);
      $.ajax({
        url: queryURL,
        method: 'GET',
        crossDomain: true
      }).then(function(ocResponse) {
        console.log(ocResponse);
        var reps = ocResponse.results;
        for (var i = 0; i < reps; i++) {
          user.federal.push(reps[i].bioguide_id)
        }
        console.log(user.federal);
        var openStatesQuery = "legistrators/geo/?lat=" + user.latitude;
        openStatesQuery += "&long=" + user.longitude
        var queryURL = openStatesURL + openStatesQuery + openStatesKey;
        $.ajax({
          url: queryURL,
          method: 'GET',
          crossDomain: true
        }).then(function(osResponse) {
          console.log(osResponse);
          var reps = osResponse;
          for (var i = 0; i < reps; i++) {
            user.state.push(reps[i].id)
          }
          console.log(user.state);

          //create firebase auth account
          firebase.auth().createUserWithEmailAndPassword(user.email, pass).catch(function(error) {
          // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            $('#modalText').text(error.message);
            $('#myModal').show();
          });

          $('#modalClose').on('click', function() {
            $('#myModal').hide();
          });

          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
              database.ref('users').child(user.uid).set({
                firstName: firstName,
                lastName: lastName,
                street: Street,
                city: City,
                state: State,
                zip: Zip,
                //   lat: response.results[0].geometry.location.lat,
                //   lng: response.results[0].geometry.location.lng,
                email: email,
              });
              window.location = 'federal.html';
            }
          });
        });
      });
    });
  } else {
    $('#modalText').text('Oops! Your passwords don\'t match!');
    $('#myModal').show();
  }
  return false;
});

$(document).on('click', '#login-button', function() {

    var email = $('#login-email').val();
    var pass = $('#login-pass').val();

    firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
        // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      $('#modalText').text(error.message);
      $('#myModal').show();
    });

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        window.location = 'federal.html';
      } else {
        $('#modalText').text('Oops! Your passwords don\'t match!');
        $('#myModal').show();
      }
      return false;
    });
});

$('#modalClose').on('click', function() {
    $('#myModal').hide();
});
