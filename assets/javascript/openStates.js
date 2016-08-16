

var siteURL = "http://openstates.org/api/v1/"
var APIkey = "f58d2e11ccbe4471bdb7485c4fee0058"

$(document).on('click', '#submit-button', function() {
    var topic = 'metadata/ca';
    var queryURL = siteURL + topic + "/?" + "&apikey=" + APIkey;
    console.log(queryURL);
    $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .done(function(response) {
            console.log(response);
        });
});
