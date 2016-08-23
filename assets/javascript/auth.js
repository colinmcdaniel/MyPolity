
var firebaseUser = firebase.auth().currentUser;
var database = firebase.database();
var userRef = database.ref("usernames");
var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0";

var sunlightDataApiKey = "f58d2e11ccbe4471bdb7485c4fee0058"
var openStatesURL = "https://openstates.org/api/v1/";
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

if(pass == confirmPass){
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);
      var user = {
        firstName: firstName,
        lastName: lastName,
        street: Street,
        city: City,
        state: State,
        zip: Zip,
        lat: response.results[0].geometry.location.lat,
        lng: response.results[0].geometry.location.lng,
        email: email,
      }
      console.log(user);
      //create firebase auth account
      firebase.auth().createUserWithEmailAndPassword(user.email, pass).catch(function(error) {
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
          window.location = 'federal.html';
        }
      });
    });
    return false;
  }  else{
    $('#modalText').text('Oops! Your passwords don\'t match!');
    $('#myModal').show();
    return false;
  }
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

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.location = 'federal.html';
    }
  });
  return false;
});

$('#modalClose').on('click', function(){
  $('#myModal').hide();
});

firebase.auth().onAuthStateChanged(function(user) {
  if(user){
    database.ref('users').child(user.uid).once('value', function(snapshot){
      $('#first-name').val(snapshot.val().firstName);
      $('#last-name').val(snapshot.val().lastName);
      $('#street').val(snapshot.val().street);
      $('#city').val(snapshot.val().city);
      $('#state').val(snapshot.val().state);
      $('#zip').val(snapshot.val().zip);
    });
  }
});

$('#edit-profile-submit').on('click', function(){
  var firstName = $('#first-name').val();
  var lastName = $('#last-name').val();
  var Street = $('#street').val().trim();
  var City = $('#city').val().trim();
  var State = $('#state').val();
  var Zip = $('#zip').val().trim();
  var email = $('#email').val();
  var pass = $('#pwd').val();
  var confirmPass = $('#confirm-pwd').val();

  var newUser = {
    firstName: firstName,
    lastName: lastName,
    street: Street,
    city: City,
    state: State,
    zip: Zip,
    latitude: -1,
    longitude: -1,
    federalReps: [],
    stateReps: [],
    localReps:[],
    email: email,
  }

  var postAddress = Street.toLowerCase().split(' ').join('+');
  postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
  postAddress += "+" + Zip;
  var queryURL = googleGeoURL + postAddress + googleGeoKey;

    $.ajax({
      url: queryURL,
      method: 'GET',
    }).then(function(geoResponse) {
      newUser.latitude = geoResponse.results[0].geometry.location.lat;
      newUser.longitude = geoResponse.results[0].geometry.location.lng;
      var openCongressQuery = "legislators/locate?latitude=" + newUser.latitude;
      openCongressQuery += "&longitude=" + newUser.longitude
      var queryURL = openCongressURL + openCongressQuery + openCongressKey;
      console.log(queryURL);
      $.ajax({
        url: queryURL,
        method: 'GET',
      }).then(function(ocResponse) {
        var reps = ocResponse.results;
        for (var i = 0; i < reps.length; i++) {
          var ocRepID = reps[i].bioguide_id;
          newUser.federalReps.push(ocRepID);
        }
        console.log(newUser.federal);
        var openStatesQuery = "legislators/geo/?lat=" + newUser.latitude;
        openStatesQuery += "&long=" + newUser.longitude
        var queryURL = openStatesURL + openStatesQuery + openStatesKey;
        $.ajax({
          url: queryURL,
          method: 'GET',
        }).then(function(osResponse) {
          var reps = osResponse;
          for (var i = 0; i < reps.length; i++) {
            osRepID = reps[i].id;
            newUser.stateReps.push(osRepID);
          }
        });
      });
    });
  return false;
  console.log(newUser);
  });

$(document).on('click', '#logout-link', function(){

  firebase.auth().signOut().then(function() {
    window.location = 'index.html';
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
});
