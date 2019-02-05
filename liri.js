require("dotenv").config();

//require variables
var axios = require("axios");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");

//spotify variables
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

inquirer.prompt([
    // {
    //     type: "input",
    //     message: "What would you like to search?  Use format concert-this <artist/band name here>",
    //     name: "concertThis",
    // },
    {
        type: "list",
        name: "wish",
        message: "Your wish is my command - what would you like to do?",
        choices: ["Find a concert", "Find a song", "Find a movie"]
    }

])

.then(function(liri) {
    //determine which code block needs to be called
    switch (liri.wish) {
        //call concertThis code block
        case "Find a concert":
            inquirer.prompt([
                {
                    type: "input",
                    message: "What artist would you like to search?",
                    name: "artist",
                },
            
            ]).then(function(artist) {
                //get artist/band name, split & join it if more than one word
                let artistName = artist.artist;
                let artistFullName = artistName.split(" ");
                let artistSearch = artistFullName.join("%20");
                console.log(artistSearch);

                //fill bands in town query URL
                let concertQuery = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp"

                //call axios
                axios.get(concertQuery)
                .then(function(response) {
                    console.log("searching");
                    //format & display results 
                    if (response.data.length > 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            console.log("-----------------------------------------");
                            console.log(response.data[i].venue.name);
                            console.log(response.data[i].venue.city);
                            console.log(response.data[i].venue.region + response.data[i].venue.country);
                            //!!! need to add and format date of concerts here !!! 
                        }
                    //if response returns 0 concerts...
                    } else {
                        console.log("\n" + "No shows found for " + artistSearch);
                    };
                }) 
                //catch any errors
                .catch(function(err) {
                    console.log(err);
                })

            });
        //call spotifyThis code block
        case "Find a song":
            inquirer.prompt([
                {
                    type: "input",
                    message: "What song would you like to find?",
                    name: "song"
                }
            ]).then(function(song) {
                //get song name, split & join it if more than one word
                let songTitle = song.song;
                let songFullTitle = songTitle.split(" ");
                let songSearch = songFullTitle.join("%20");

                //search spotify
                spotify.search({
                    type: "track",
                    query: "songSearch",
                    limit: 1,
                })
                //format & display results
                .then(function(response) {
                    console.log("Searching for " + songTitle);
                    console.log(response);
                    var song = response.tracks.items[0];
                  

                    if (song != undefined) {
                        console.log("-----------------------------------------");
                        // console.log(song.name);
                        console.log(song.artists[i]);
                        console.log(song.album.name);
                        console.log(song.preview_url);
                    } else { 
                        console.log("\n" + "No songs found, sorry!  Try again.");
                    }
                })
                //catch any errors
                .catch(function(err) {
                    console.log(err);
                })

            })
        
        //call movieThis code block
        //call dowhatitsays code block

    }
});
          
// * If no song is provided then your program will default to "The Sign" by Ace of Base.



