require("dotenv").config();

//require variables
var axios = require("axios");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var colors = require("colors");
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
                console.log("\n...Searching for ".blue + artistName.blue + " concerts...".blue);

                //fill bands in town query URL
                let concertQuery = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp"

                //call axios
                axios.get(concertQuery)
                .then(function(response) {
            
                    //format & display results 
                    if (response != 0) {
                        for (var i = 0; i < response.data.length; i++) {
                            console.log("-----------------------------------------".blue);
                            console.log("\nVenue: ".green + response.data[i].venue.name);
                            // console.log("\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYY"));
                            //!!! need to add and format date of concerts here !!!
                            console.log("\nCity: ".green + response.data[i].venue.city);
                            console.log("\nState: ".green + response.data[i].venue.region + "\nCountry: ".green + response.data[i].venue.country);
                             
                        }
                    } else {
                        console.log("\nNo shows found for ".underline.red + artistSearch.underline.red);
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
                
                console.log("\n...Searching for ".blue + songTitle.blue + "...".blue);

             
                spotify.search({
                    type: "track",
                    query: songSearch,
                    limit: 1,
                })
              
                .then(function(response) {
        
                    let song = response.tracks.items[0];

                    if (response.length != 0) {//this needs to change - response.length doesn't work here
                        console.log("\n-----------------------------------------".blue);
                        console.log("\nSong: ".magenta + song.name);
                        console.log("\nArtist: ".magenta + song.album.artists[0].name);
                        console.log("\nAlbum: ".magenta + song.album.name);
                        console.log("\nURL: ".magenta + song.preview_url);
                        console.log("\n-----------------------------------------".blue);
                    } else {
                        //!! default to Ace of Base if song not found/no song entered !!
                        console.log("Need Ace of Base here");
                    }
                })
                //catch any errors
                .catch(function(err) {
                    console.log(err);
                })

            });
            break;



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
                    console.log("\n...Searching for ".blue + movieTitle.blue + "...".blue);

                    //fill query URL
                    let movieQuery = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy"

                    //call axios
                    axios.get(movieQuery)
                    .then(function(response) {

                        console.log("\n-----------------------------------------".blue);
                        console.log("\nMovie Title: ".green + response.data.Title);
                        console.log("\nRelease Year: ".green + response.data.Year);
                        console.log("\nimdb Rating: ".green + response.data.imdbRating);
                        console.log("\nRotten Tomatoes Rating: ".green + response.data.Ratings[1].Value); 
                            console.log("** Guide to Rotten Tomatoes ratings: less than 60% is a 'splat,' or a bad review **".red);
                        console.log("\nProduced in: ".green + response.data.Country);
                        console.log("\nLanguage: ".green + response.data.Language);
                        console.log("\nPlot Summary: ".green + response.data.Plot);
                        console.log("\nActors: ".green + response.data.Actors);
                        console.log("\n-----------------------------------------".blue);
                        
                        //format and display results
                        if (response != 0) {//this needs to change, doesn't work
                            for (var i = 0; i < response.data.length; i++) {
                                console.log("\n-----------------------------------------");
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
          



// TO DO:
    // add colors
    // make recursive
    // add moment/format concert date
    // do whatitsays
    // fix if statements
    // default to Ace of Base - songs
    // default to Mr Nobody - movies
    // add in error catching for URL = null

