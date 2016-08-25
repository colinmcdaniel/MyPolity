var fetchData = function() {
  return new Promise(function(resolve, reject) {
    // ADD FUNCTION TO GET REPRESENTITIVES
  });
}

var sendToFirebase = function() {
  return new Promise(function(resolve, reject) {
    // Add function to send DATA to FIREBASE
  });
};

fetchData().then(function() {
  return sendToFirebase();
})
