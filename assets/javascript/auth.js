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

$(document).ready(function() {
  var firstNameComplete = false;
  var lastNameComplete = false;
  var streetAddressComplete = false;
  var cityComplete = false;
  var zipCodeComplete = false;
  var emailComplete = false;
  var passwordComplete = false;
  var confirmPasswordComplete = false;

  $("#first-name").keyup(function(){
    if($("#first-name").val() != ""){
      firstNameComplete = true;
      hasSuccess("#first-name-group","#first-name-span");
    }
    else{
      firstNameComplete = false;
      hasError("#first-name-group","#first-name-span");
    }
    checkForm();
  });
  $("#last-name").keyup(function(){
    if($("#last-name").val() != ""){
      lastNameComplete = true;
      hasSuccess("#last-name-group","#last-name-span");
    }
    else{
      lastNameComplete = false;
      hasError("#last-name-group","#last-name-span");
    }
    checkForm();
  });
  $("#street").keyup(function(){
    if($("#street").val() != ""){
      streetAddressComplete = true;
      hasSuccess("#street-address-group","#street-address-span");
    }
    else{
      streetAddressComplete = false;
      hasError("#street-address-group","#street-address-span");
    }
    checkForm();
  });
  $("#city").keyup(function(){
    if($("#city").val() != ""){
      cityComplete = true;
      hasSuccess("#city-group","#city-span");
    }
    else{
      cityComplete = false;
      hasError("#city-group","#city-span");
    }
    checkForm();
  });
  $("#zip").keyup(function(){
    if($("#zip").val() != "" && $("#zip").val().length == 5 && $.isNumeric($("#zip").val())){
      zipCodeComplete = true;
      hasSuccess("#zip-code-group","#zip-code-span");
    }
    else{
      zipCodeComplete = false;
      hasError("#zip-code-group","#zip-code-span");
    }
    checkForm();
  });
  $("#email").keyup(function(){
    if($("#email").val() != "" && $("#email").val().includes("@") && $("#email").val().includes(".") && $("#email").val().length > 5){
      emailComplete = true;
      hasSuccess("#email-group","#email-span");
    }
    else{
      emailComplete = false;
      hasError("#email-group","#email-span");
    }
    checkForm();
  });
  $("#pwd").keyup(function(){
    if($("#pwd").val() != ""){
      passwordComplete = true;
      hasSuccess("#password-group","#password-span");
    }
    else{
      passwordComplete = false;
      hasError("#password-group","#password-span");
    }
    checkForm();
  });
  $("#confirm-pwd").keyup(function(){
    if($("#confirm-pwd").val() != "" && $("#confirm-pwd").val() == $("#pwd").val()){
      confirmPasswordComplete = true;
      hasSuccess("#confirm-password-group","#confirm-password-span");
    }
    else{
      confirmPasswordComplete = false;
      hasError("#confirm-password-group","#confirm-password-span");
    }
    checkForm();
  });

  function checkForm(){
  if(firstNameComplete&&lastNameComplete&&streetAddressComplete&&cityComplete&&zipCodeComplete&&emailComplete&&passwordComplete&&confirmPasswordComplete)
    $("#submit-button").prop("disabled",false);
  else
    $("#submit-button").prop("disabled",true);
  }
  function hasSuccess(divID,spanID){
    $(divID).removeClass("has-error has-feedback");
    $(divID).addClass("has-success has-feedback");
    $(spanID).removeClass("glyphicon glyphicon-remove form-control-feedback");
    $(spanID).addClass("glyphicon glyphicon-ok form-control-feedback");
  }
  function hasError(divID,spanID){
    $(divID).removeClass("has-success has-feedback");
    $(divID).addClass("has-error has-feedback");
    $(spanID).removeClass("glyphicon glyphicon-ok form-control-feedback");
    $(spanID).addClass("glyphicon glyphicon-remove form-control-feedback");
  }
});



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

  if(pass == confirmPass){
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

          //create firebase auth account
          firebase.auth().createUserWithEmailAndPassword(newUser.email, pass).catch(function(error) {
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
              database.ref('users').child(user.uid).set(newUser);
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

$('#modalClose').on('click', function() {
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

            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                database.ref('users').child(user.uid).set(newUser);
                window.location = 'federal.html';
              }
            });
          });
        });
      });
    return false;
      window.location('federal.html');
    });
});

$(document).on('click', '#logout-link', function(){

  firebase.auth().signOut().then(function() {
    window.location = 'index.html';
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
});

$('#edit-password').on('click', function(){
  window.location = 'pass-change.html';
  return false;
});

$('#edit-password-submit').on('click', function(){
  var pass = $('#new-pwd').val();
  var confirmPass = $('#confirm-new-pwd').val();
  if(pass == confirmPass){
    var user = firebase.auth().currentUser;
    user.updatePassword(pass).then(function() {
      window.location = 'federal.html';
    }, function(error) {
      $('#modalText').text('An unexpected error occurred. Please try again.');
      $('#myModal').show();
    });
  } else{
    $('#modalText').text('Oops! Your passwords don\'t match!');
    $('#myModal').show();
  }
  return false;
});
