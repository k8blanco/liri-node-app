require("dotenv").config();

//require variables
var axios = require("axios");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var fs = require("fs");

//spotify variables
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


inquirer.prompt([
    {
        type: "list",
        name: "command",
        message: "Your wish is my command - what would you like to do?",
        choices: ["Find a concert", "Find a song", "Find a movie"]
    }

])

.then(function(liri) {
    //determine which code block needs to be called
    switch (liri.command) {

//---------------------- concertThis --------------------------

        case "Find a concert":
            inquirer.prompt([
                {
                    type: "input",
                    message: "What artist would you like to search?",
                    name: "artist",
                },
            
            ]).then(function(artist) {
                let artistName = artist.artist; //this is the artist name
                let artistFullName = artistName.split(" "); //this parses the artist name
                let artistSearch = artistFullName.join("%20"); //this joins the artist name with %20 instead of spaces
                console.log("Searching for " + artistName + "concerts");

                //fill bands in town query URL
                let concertQuery = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp"

                //call axios
                axios.get(concertQuery)
                .then(function(response) {
            
                    //format & display results 
                    if (response != 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            console.log("-----------------------------------------");
                            console.log(response.data[i].venue.name);
                            console.log(response.data[i].venue.city);
                            console.log(response.data[i].venue.region + response.data[i].venue.country);
                            //!!! need to add and format date of concerts here !!! 
                        }
                    } else {
                        console.log("\n" + "No shows found for " + artistSearch);
                    };
                }) 
                //catch any errors
                .catch(function(err) {
                    console.log(err);
                })

            });
            break;

//---------------------- spotifyThis --------------------------

        case "Find a song":
            inquirer.prompt([
                {
                    type: "input",
                    message: "What song would you like to find?",
                    name: "song"
                },

            ]).then(function(song) {
                let songTitle = song.song; 
                let songFullTitle = songTitle.split(" "); 
                let songSearch = songFullTitle.join("%20");
                
                console.log("Searching for " + songTitle);

                //search spotify
                spotify.search({
                    type: "track",
                    query: songSearch,
                    limit: 1,
                })
                //format & display results
                .then(function(response) {
                    // console.log(response.tracks);
                    // var stringify = JSON.stringify(response);
                    // console.log(stringify);
                    
                
                    let song = response.tracks.items[0];

                    if (response.length != 0) {
                        console.log("\n-----------------------------------------");
                        console.log("\nSong: " + song.name);
                        console.log("\nArtist: " + song.album.artists[0].name);
                        console.log("\nAlbum: " + song.album.name);
                        console.log("\nURL: " + song.preview_url);
                        console.log("\n-----------------------------------------");
                    } else {
                        console.log("Need Ace of Base here");
                    }
                })
                //catch any errors
                .catch(function(err) {
                    console.log(err);
                })

            });
            break;
            // * If no song is provided then your program will default to "The Sign" by Ace of Base.


//---------------------- movieThis --------------------------

            case "Find a movie":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What movie would you like to find?",
                        name: "movie"
                    },

                ]).then(function(movie) {
                    let movieTitle = movie.movie;
                    let movieFullTitle = movieTitle.split(" ");
                    let movieSearch = movieFullTitle.join("%20");
                    console.log("Searching for " + movieTitle);

                    //fill query URL
                    let movieQuery = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy"

                    //call axios
                    axios.get(movieQuery)
                    .then(function(response) {
                        
                        //format and display results
                        if (response != 0) {
                            for (var i = 0; i < response.data.length; i++) {
                                console.log("-----------------------------------------");
                                console.log(response)
                            }
                        } else {
                            console.log("\n" + "No movies matching " + movieTitle + "were found.");
                        };
                    })
                    //catch any errors
                    .catch(function(err) {
                        console.log(err);
                    })
            
                });
                break;
          
            
    
        //call dowhatitsays code block

    }

});
          



