

// var siteURL = "http://openstates.org/api/v1/"
// var APIkey = "f58d2e11ccbe4471bdb7485c4fee0058"


// $(document).on('click', '#search_button', function() {
//     // var topic = 'metadata/ca'; + topic + "/?" +
//     var geoKey = "AIzaSyAt-c78Z1cXHLrKs0IyHrq6s0xEkrF1lwQ";
//     var zip = $('#zipInput').val();
//     var geoLocationURL ="https://maps.googleapis.com/maps/api/geocode/json?address="+zip+"&key=";

//     var queryURL = geoLocationURL + geoKey;
//     console.log(queryURL);
//     $.ajax({
//             url: queryURL,
//             method: 'GET'
//         })
//         .done(function(response) {
//             console.log(response);
//         });
// });

var apiKey= "b99e520ffe6d47598d080c2ffafd1b3e";


//for now this will pull up the latest articles
var queryURL = "https://newsapi.org/v1/articles?source=cnn&sortByAvailable=latest&apiKey=" +apiKey;

// FUNCTIONS

// This runQuery function expects two parameters (the number of articles to show and the final URL to download data from)
function runQuery(queryURL){

    // The AJAX function uses the URL and Gets the JSON data associated with it. The data then gets stored in the variable called: "NYTData"
     $.ajax({
                url: queryURL,
                method: 'GET'
            })
            .done(function(response) {
                var results = response.articles;

                for (var i = 0; i < results.length; i++) {

                    //making div for each article - includes title, image & description
                    var slidesDiv = $('<div class="recentArticles">')

                    //referencing the articles
                    var article = results[i].articles;

                    //references the articles images
                    var articleImg = results[i].urlToImage;

                    //turns the images into buttons
                    var articleImgBtn = $('<button src = "' +articleImg+ '">');

                    //getting the articles titles
                    var articleTitle = $('<p>');
                    articleDescription.attr('src', results[i].title);
                    articleDescription.attr('class', 'articleSlides');

                    //appending the title and the image button to the new div
                    slidesDiv.append(articleTitle);
                    slidesDiv.append(articleImgBtn);

                    //appending our new div into our div class '.slides' on the HTML file
                    $('.slides').prepend(slidesDiv);
                }

            });
    }

            // Loop through articles on JSON and we want 5 articles in slick track.
            for (var i=0; i <= 5; i++) {
                runQuery(queryURL);
            }

// // METHODS
// // ==========================================================
    
    // On Click button associated with the Search Button
    $('#articleSlides').on('click', function(){

        // Empties the region associated with the articles
        $("#wellSection").empty();

        // Search Term
        var searchTerm = $('#searchTerm').val().trim();
        queryURL = queryURLBase + searchTerm;

        // Num Results
        numResults = $("#numRecordsSelect").val();

        // Start Year
        startYear = $('#startYear').val().trim();

        // End Year
        endYear = $('#endYear').val().trim();

        // If the user provides a startYear -- the startYear will be included in the queryURL
        if (parseInt(startYear)) {
            queryURL = queryURL + "&begin_date=" + startYear + "0101";
        }

        // If the user provides a startYear -- the endYear will be included in the queryURL
        if (parseInt(endYear)) {
            queryURL = queryURL + "&end_date=" + endYear + "0101";
        }

        // Then we will pass the final queryURL and the number of results to include to the runQuery function
        runQuery(queryURL);

        // This line allows us to take advantage of the HTML "submit" property. This way we can hit enter on the keyboard and it registers the search (in addition to clicks).
        return false;
    }); 

// This button clears the top articles section
$('#clearAll').on('click', function(){

})
 