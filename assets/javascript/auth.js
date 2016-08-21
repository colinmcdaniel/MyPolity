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
