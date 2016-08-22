var openStatesURL = "http://openstates.org/api/v1/"
var openStatesKey = "&apikey=f58d2e11ccbe4471bdb7485c4fee0058"

var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0"

var googleCivicURL = "https://www.googleapis.com/civicinfo/v2/"
var googleCivicKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0"

// var Street = "8331 Keokuk Ave";
// var City = "Winnetka";
// var State = "CA";
// var Zip = "91306"


$(document).on('click', '#submit-button', function() {
    var name = $('#name').val();
    var Street = $('#street').val().trim();
    var City = $('#city').val().trim();
    var State = $('#state').val();
    var Zip = $('#zip').val().trim();
    var postAddress = Street.toLowerCase().split(' ').join('+');
    postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
    postAddress += "+" + Zip;
    console.log(postAddress);
    var topic = 'metadata/ca';
    // var queryURL = siteURL + topic + "/?" + "&apikey=" + APIkey;

    var queryURL = googleGeoURL + postAddress + googleGeoKey;
    var user = {
        name: name,
        street: Street,
        city: City,
        state: State,
        zip: Zip,
    };
    console.log(user);

    $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .then(function(response) {
            var lat = response.results[0].geometry.location.lat;
            var lng = response.results[0].geometry.location.lng;

        }).then(function(result) {

        });
    return false;
});

$(document).ready(function() {
    $('.slides').slick({
        arrows: true,
        dots: true,
        slidesToShow: 2,
        infinite: true,
        responsive: [
    // {
    //   breakpoint: 1024,
    //   settings: {
    //     slidesToShow: 3,
    //     slidesToScroll: 3,
    //     infinite: true,
    //     dots: true
    //   }
    // },
    // {
    //   breakpoint: 600,
    //   settings: {
    //     slidesToShow: 2,
    //     slidesToScroll: 2
    //   }
    // },
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
});
