// Colin's Firebase
  // var fff = {
  //   apiKey: "AIzaSyB8TqG5FuYXornV5pOfov-IRbGJH3y-epw",
  //   authDomain: "mypolity-temp.firebaseapp.com",
  //   databaseURL: "https://mypolity-temp.firebaseio.com",
  //   storageBucket: "mypolity-temp.appspot.com",
  // };
  // firebase.initializeApp(fff);
//Spencer's Firebase

var config = {
apiKey: "AIzaSyA6P8YWzzxROrGRStOxa1kEFbDau5SVzW8",
authDomain: "mypolity-4808b.firebaseapp.com",
databaseURL: "https://mypolity-4808b.firebaseio.com",
storageBucket: "mypolity-4808b.appspot.com",
};

//Gary firebase

// var config = {
//   apiKey: "AIzaSyDo0YPqvSLALkV93436vn8Qj8s1AoBBmow",
//   authDomain: "mypolity-d8c63.firebaseapp.com",
//   databaseURL: "https://mypolity-d8c63.firebaseio.com",
//   storageBucket: "mypolity-d8c63.appspot.com",
// };

firebase.initializeApp(config);

var openStatesURL = "http://openstates.org/api/v1/"
var openStatesKey = "&apikey=f58d2e11ccbe4471bdb7485c4fee0058"

var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0"

var firebaseUser = firebase.auth().currentUser;
var database = firebase.database();
var userRef = database.ref("usernames");

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
    console.log(postAddress);
    var topic = 'metadata/ca';
    // var queryURL = siteURL + topic + "/?" + "&apikey=" + APIkey;

    var queryURL = googleGeoURL + postAddress + googleGeoKey;
    var user = {
        firstName: firstName,
        lastName: lastName,
        street: Street,
        city: City,
        state: State,
        zip: Zip,
        email: email,
    };

    $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .then(function(response) {
            console.log(response);
        }).then(function(result) {

        });

    //creat firebase auth account
    firebase.auth().createUserWithEmailAndPassword(user.email, pass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    });
    return false;
});

$(document).on('click', '#login-button', function(){

  var email = $('#login-email').val();
  var pass = $('#login-pass').val();

  firebase.auth().signInWithEmailAndPassword(email, pass).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      window.location = 'federal.html';
      $('#login-link').css('display', 'none');
      $('#logout-link').css('display', 'block');
    } else {
      console.log('Signed Out');
      $('#logout-link').css('display', 'none');
      $('#login-link').css('display', 'block');
      $('#sign-up').show();
    }
  });
  return false;
});

$(document).on('click', '#logout-link', function(){

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('Signed In');
    // location.href='federal.html'
    $('#login-link').css('display', 'none');
    $('#logout-link').css('display', 'block');
    // window.location = 'federal.html';
  } else {
    console.log('Signed Out');
    $('#logout-link').css('display', 'none');
    $('#login-link').css('display', 'block');
    $('#sign-up').show();
  }
});

$(document).ready(function() {
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

    for(var i = 0; i < dummyVars.length; i++){
      drawTableRow(dummyVars[i]);
    }

    function drawTableRow(representative){
      var tr = $('<tr>');
      tr.append($('<td class="text-center">').text(representative.name));
      tr.append($('<td class="text-center">').text(representative.title));
      tr.append($('<td class="text-center">').text(representative.party));
      tr.append($('<td class="text-center">').append(representative.phone + '<br>', representative.email + '<br>', representative.address));
      tr.append($('<td class="text-center">').text(representative.currentProjects));
      if(representative.party == 'Democrat'){
        tr.attr('class', 'info');
      } else if(representative.party == 'Republican'){
        tr.attr('class', 'danger');
      }

      $('#table-body').append(tr);
    }
});
