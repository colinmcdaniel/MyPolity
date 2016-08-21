// var Db;

//   // Initialize Firebase
// $(document).ready(function(){
//   var config = {
//     apiKey: "AIzaSyDo0YPqvSLALkV93436vn8Qj8s1AoBBmow",
//     authDomain: "mypolity-d8c63.firebaseapp.com",
//     databaseURL: "https://mypolity-d8c63.firebaseio.com",
//     storageBucket: "mypolity-d8c63.appspot.com",
//   };
//   firebase.initializeApp(config);
//   Db = firebase.database();

//
// });

var config = {
apiKey: "AIzaSyA6P8YWzzxROrGRStOxa1kEFbDau5SVzW8",
authDomain: "mypolity-4808b.firebaseapp.com",
databaseURL: "https://mypolity-4808b.firebaseio.com",
storageBucket: "mypolity-4808b.appspot.com",
};

firebase.initializeApp(config);

var firebaseUser = firebase.auth().currentUser;
var database = firebase.database();
var userRef = database.ref("usernames");

$(document).on('click', '#submit-button', function() {
    var firstName = $('#first-name').val();
    var lastName = $('#last-name').val();
    var Street = $('#street').val().trim();
    var City = $('#city').val().trim();
    var State = $('#state').val();
    var Zip = $('#zip').val().trim();
    var email = $('#email').val();
    var pass = $('#pwd').val();
    var user = {
        firstName: firstName,
        lastName: lastName,
        street: Street,
        city: City,
        state: State,
        zip: Zip,
        email: email,
    };
    //creat firebase auth account
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
          email: email,
        })
        window.location = 'federal.html';
      }
    });
    return false;
});
