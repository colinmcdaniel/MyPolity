var googleCivicURL = "https://www.googleapis.com/civicinfo/v2/"
var googleCivicKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0";

// var Street = "8331 Keokuk Ave";
// var City = "Winnetka";
// var State = "CA";
// var Zip = "91306";

// var Street = "412 Hall Ranch Rd";
// var City = "Grafton";
// var State = "VT";
// var Zip = "05146";


// var postAddress = "?&address=";
// postAddress += Street.toLowerCase().split(' ').join('+');
// postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
// postAddress += "+" + Zip;

// var queryOptions = "representatives/";
// var queryURL = googleCivicURL + queryOptions + postAddress + googleCivicKey;


var divisions;
var offices;
var officeIndices = [];
var officials;
var officialsIndices = [];
var localReps = [];
var Representitives = [];

function getReps(){
  var postAddress = "?&address=";
  postAddress += Street.toLowerCase().split(' ').join('+');
  postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
  postAddress += "+" + Zip;

  var queryOptions = "representatives/";
  var queryURL = googleCivicURL + queryOptions + postAddress + googleCivicKey;


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
          newRep.name = localReps[rep].official.name;
          newRep.party = localReps[rep].official.party;
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
          Representitives.push(newRep);
          // console.log(newRep);
      }
  });
};
