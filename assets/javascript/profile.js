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
var email;

firebase.auth().onAuthStateChanged(function(user) {
  if(user){
    email = user.email;
    database.ref('users').child(user.uid).once('value', function(snapshot){
      $('#edit-first-name').val(snapshot.val().firstName);
      $('#edit-last-name').val(snapshot.val().lastName);
      $('#edit-street').val(snapshot.val().street);
      $('#edit-city').val(snapshot.val().city);
      $('#edit-state').val(snapshot.val().state);
      $('#edit-zip').val(snapshot.val().zip);
    });
  }
});

$('#edit-profile-submit').on('click', function(){
  var firstName = $('#edit-first-name').val();
  var lastName = $('#edit-last-name').val();
  var Street = $('#edit-street').val().trim();
  var City = $('#edit-city').val().trim();
  var State = $('#edit-state').val();
  var Zip = $('#edit-zip').val().trim();
  var representatives = [];
  var postAddress = "?&address=";
  postAddress += Street.toLowerCase().split(' ').join('+');
  postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
  postAddress += "+" + Zip;
  var queryOptions = "representatives/";
  var queryURL = googleCivicURL + queryOptions + postAddress + googleCivicKey;
  console.log(queryURL);
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
          console.log(representatives);
      }
      var newUser = {
        firstName: firstName,
        lastName: lastName,
        street: Street,
        city: City,
        state: State,
        zip: Zip,
        latitude: -1,
        longitude: -1,
        email: email,
        representatives: representatives
      }

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          database.ref('users').child(user.uid).set(newUser);
          window.location = 'table.html'
        } else {
        }
      });
  });
  return false;
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
      window.location = 'table.html';
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

$(document).on('click', '#logout-link', function(){

  firebase.auth().signOut().then(function() {
    window.location = 'index.html';
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
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
      window.location = 'table.html';
    }
  });
  return false;
});

$('#modalClose').on('click', function() {
    $('#myModal').hide();
});

$('#zip-search-submit').on('click', function(){
  var Zip = $('#zip-search').val();
  sessionStorage.setItem('Zip', Zip);
  window.location = 'zip.html';
});
