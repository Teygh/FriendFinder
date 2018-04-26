// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on friends,  etc.
// ===============================================================================

var friends = require("../data/friends.js");



// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
// API GET Requests
// Below code handles when users "visit" a page.
// In each of the below cases when a user visits a link
// (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table)
// ---------------------------------------------------------------------------

app.get("/api/friends", function (req, res) {
    res.json(friends);
});



// API POST Requests
// Below code handles when a user submits a form and thus submits data to the server.
// In each of the below cases, when a user submits form data (a JSON object)
// ...the JSON is pushed to the appropriate JavaScript array
// (ex. User fills out a survey... this data is then sent to the server...
// Then the server saves the data to the friends array)
// ---------------------------------------------------------------------------


// Below is the CODE for Matching the Users answers with the best possible match(Person) in the database.

app.post("/api/friends", function (req, res) {

    var diff = 30;
    var matchName = "";
    var matchPhoto = "";

    //ForEach loop to loop through the Array of Friends.
    friends.forEach(function (friend) {

        var matchedScores = [];
        var currentDiff = 30;

        
        for (var i = 0; i < friend.scores.length; i++) {
            matchedScores.push(Math.abs(parseInt(req.body.scores[i]) - parseInt(friend.scores[i])));
            // Math.abs returns the absolute value (Always a positive integer).
        }

        // Using the Reduce method the values in the array are reduced to a  single value.
        currentDiff = matchedScores.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue;
          }, 0);

        // If the current diff is smaller than the previous difference
        if (currentDiff < diff) {
            diff = currentDiff;
            // And set these variables to the appropriate friend match
            matchName = friend.name;
            matchPhoto = friend.photo;
        }
    });
    //This cycle will continue till the least Diff between two users is found and then the cycle stops
    // the resulting match is then send to the iuser
    res.json({
        name: matchName,
        photo: matchPhoto
    });

    // This adds the new users sent data object to friends.js
    friends.push(req.body);
});

}




