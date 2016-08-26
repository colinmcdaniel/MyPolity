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
    if($("#street").val() != "" && /\d/.test($("#street").val()) && /[a-zA-Z]/.test($("#street").val())){
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
    if($("#email").val() != "" && $("#email").val().includes("@") && $("#email").val().includes(".") && $("#email").val().length > 5 && $("#email").val().indexOf("@.") == -1 && $("#email").val().indexOf(" ") == -1){
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

      if($("#confirm-pwd").val() != ""){
        if($("#confirm-pwd").val() == $("#pwd").val()){
          confirmPasswordComplete = true;
          hasSuccess("#confirm-password-group","#confirm-password-span");
        }
        else{
          confirmPasswordComplete = false;
          hasError("#confirm-password-group","#confirm-password-span");
        }
      }
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
    $("#submit-button").removeAttr("disabled");
  else
    $("#submit-button").attr("disabled",true);
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
  var representatives = [];
  var postAddress = "?&address=";
  postAddress += Street.toLowerCase().split(' ').join('+');
  postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
  postAddress += "+" + Zip;
  var queryOptions = "representatives/";
  var queryURL = googleCivicURL + queryOptions + postAddress + googleCivicKey;

  $.ajax({
      url: queryURL,
      method: 'GET',
      error: function(){
        $('#modalText').text("The address you entered was not found. Please try again.");
        $('#myModal').show();
      }
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
            window.location = 'table.html'
          } else {
          }
        });
  });


  return false;
});

function getNews(query) {
  $('#news').empty();
  $('#news-header').text('Top News About ' + query + ':');
  var params = {
      "q": query,
      "count": "10",
      "offset": "0",
      "mkt": "en-us",
      "safeSearch": "Moderate",
  };
  $.ajax({
      url: "https://api.cognitive.microsoft.com/bing/v5.0/news/search?" + $.param(params),
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","429642e6b34842d1900847e542179aca");
      },
      type: "GET",
      // Request body
      data: "body",
  }).done(function(data) {
      var response = data.value;
      var div = $('<div class="owl-carousel" id="repNews"></div>');
      for(var i = 0; i < response.length; i++){

        var headline = response[i].name;
        var description = response[i].description;
        var articleURL = response[i].url;
        var slidesDiv = $('<div class="recentArticles">');
        slidesDiv.attr("class", "slidesDivClass");
        var articleHeadline = $('<h4>');
        var articleDescription = $('<p>');
        articleHeadline.text(headline);
        articleDescription.text(description);
        slidesDiv.append(articleHeadline);
        slidesDiv.append(articleDescription);
        slidesDiv.attr('data-url', articleURL);
        div.append(slidesDiv);
        $('#news').append(div);
        $(".slidesDivClass").on("click", function(){
            var url = $(this).attr('data-url');
            window.open(url);
        });
      }
      owl(query);
  })
  .fail(function() {
      console.log('News API Error');
  });
}
