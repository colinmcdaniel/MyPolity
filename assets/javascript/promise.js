var fetchData = function() {
  return new Promise(function(resolve, reject) {
    // ADD FUNCTION TO GET REPRESENTITIVES
    // REPLACE the Console.log below with the function to get representitives
    resolve(console.log("Getting representitives"));
  });
}

var sendToFirebase = function() {
  return new Promise(function(resolve, reject) {
    // REPLACE the Console.log below with the function to send to firebase
    resolve(console.log("Sending to Firebase"));
  });
};

// run these in order by calling the following:
fetchData().then(function() {
  return sendToFirebase();
})
