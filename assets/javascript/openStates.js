var openStatesURL = "http://openstates.org/api/v1/"
var openStatesKey = "&apikey=f58d2e11ccbe4471bdb7485c4fee0058"

var googleGeoURL = "https://maps.googleapis.com/maps/api/geocode/json?address="
var googleGeoKey = "&key=AIzaSyBV2UtJ0s2yvwvJQl7wDajnuzCnGevAnE0"


var Street = "8331 Keokuk Ave";
var City = "Winnetka";
var State = "CA";
var Zip = "91306"


$(document).on('click', '#submit-button', function() {
    var postAddress = Street.toLowerCase().split(' ').join('+');
    postAddress += "+" + City.toLowerCase() + "+" + State.toLowerCase();
    postAddress += "+" + Zip;
    console.log(postAddress);
    var topic = 'metadata/ca';
    // var queryURL = siteURL + topic + "/?" + "&apikey=" + APIkey;

    var queryURL = googleGeoURL + postAddress + googleGeoKey;
    var user = {
        zip: ('#zip').val()
    };

    $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .then(function(response) {
            console.log(response);
        }).then(function(result) {

        })
});

$(document).ready(function() {
    $('.slides').slick({
        arrows: true,
        dots: true,
        slidesToShow: 2,
        infinite: true
    });
});
