require("dotenv").config();

//required package variables
var axios = require("axios");
var inquirer = require("inquirer");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var fs = require("fs");
var colors = require("colors");

//spotify variables
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

//global command variables
var artistSearch
var songSearch
var movieSearch

//make recursive

var askLIRI = function() {

inquirer.prompt([
    {
        type: "list",
        name: "command",
        message: "Your wish is my command - what would you like to do?",
        choices: ["Find a concert", "Find a song", "Find a movie", "Do what it says"]
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
                artistSearch = artistFullName.join("%20"); //this joins the artist name with %20 instead of spaces

                concertCall();
                logToFile("Concert Search: " + artistName);

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

                if (song.song == "") {
                    songSearch = "The Sign ace of base";
                } else {
                    songSearch = song.song;
                };       

                songCall();
                logToFile("Song Search: " + songSearch);

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

                    if (movie.movie == "") {
                        movieSearch = "Mr.+Nobody";
                    } else {
                        let movieTitle = movie.movie;
                        let movieFullTitle = movieTitle.split(" ");
                        movieSearch = movieFullTitle.join("%20");
                    }
                    
                    movieCall();
                    logToFile("Movie Search: " + movieSearch);
 
                });
                break;
          
            
//---------------------- Do what it says --------------------------
                case "Do what it says":

                    fs.readFile("random.txt", "utf8", function(err, data) {
                        if (err){
                            console.log(error);
                        } 

                        console.log(data);
                        var caseDataArr = data.split(",");


                        if (caseDataArr[0] === "Find a concert") {
                            let artistName = caseDataArr[1];
                            //split name and URL-ify it
                            let artistFullName = artistName.split(" ");
                            artistSearch = artistFullName.join("%20");
                            concertCall();
                        }

                        else if (caseDataArr[0] === "Find a song") {
                            songSearch = caseDataArr[1];
                            songCall();
                        }

                        else if (caseDataArr[0] === "Find a movie") {
                            let movieTitle = caseDataArr[1];
                            //split movie name and URL-ify it
                            let movieFullTitle = movieTitle.split(" ");
                            movieSearch = movieFullTitle.join("%20");
                            movieCall();
                        }

                    });
                break;


    }
   
});

};

//call askLIRI run code
askLIRI();

//global functions

function concertCall() {
    //fill bands in town query URL
    let concertQuery = "https://rest.bandsintown.com/artists/" + artistSearch + "/events?app_id=codingbootcamp"

    //call axios
    axios.get(concertQuery)
    .then(function(response) {

        //format & display results 
        if (response.data.length > 0 && response.data[0].venue != undefined) {
            for (var i = 0; i < response.data.length; i++) {
                console.log("-----------------------------------------".blue);
                console.log("\nVenue: ".green + response.data[i].venue.name);
                console.log("\nDate: ".green + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log("\nCity: ".green + response.data[i].venue.city);
                console.log("\nState: ".green + response.data[i].venue.region + "\nCountry: ".green + response.data[i].venue.country);

                logToFile(
                    "\nVenue: " + response.data[i].venue.name +
                    "\nDate: " + moment(response.data[i].datetime).format("MM/DD/YYYY") +
                    "\nCity: " + response.data[i].venue.city +
                    "\nState: " + response.data[i].venue.region + 
                    "\nCountry: " + response.data[i].venue.country);                     
            }
        } else {
            console.log("\nNo shows found for ".underline.red + artistSearch.underline.red);
            logToFile("\nNo shows found for " + artistSearch);
        };

        recursion();
    }) 
    //catch any errors
    .catch(function(err) {
        console.log(err);
    })
};

function songCall() {

    spotify.search({
        type: "track",
        query: songSearch,
        limit: 1,
    })
  
    .then(function(response) {

        let song = response.tracks.items[0];

        if (song != undefined) {
        console.log("\n-----------------------------------------".blue);
        console.log("\nSong: ".magenta + song.name);
        console.log("\nArtist: ".magenta + song.album.artists[0].name);
        console.log("\nAlbum: ".magenta + song.album.name);
        console.log("\nURL: ".magenta + song.preview_url);
        console.log("\n-----------------------------------------".blue);
        
        logToFile(
            "\nSong: " + song.name +
            "\nArtist: " + song.album.artists[0].name +
            "\nAlbum: " + song.album.name +
            "\nURL: " + song.preview_url);
        } else {
            console.log("\nUh oh, I couldn't find that song!".underline.red);
            logToFile("\nUh oh, I couldn't find that song!");
        }
            recursion();
    })

    //catch any errors
    .catch(function(err) {
        console.log(err);
    })
};

function movieCall() {
    //fill query URL
    let movieQuery = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy"

    //call axios
    axios.get(movieQuery)
    .then(function(response) {
        if (response.data.Title != undefined) {
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

        logToFile(
            "\nMovie Title: " + response.data.Title +
            "\nRelease Year: " + response.data.Year +
            "\nimdb Rating: " + response.data.imdbRating +
            "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
            "\nProduced in: " + response.data.Country +
            "\nLanguage: " + response.data.Language +
            "\nPlot Summary: " + response.data.Plot +
            "\nActors: " + response.data.Actors);

        } else {
            console.log("\nUh oh, couldn't find that movie!".underline.red);
            logToFile("\nUh oh, couldn't find that movie!");
        }
            recursion();

    })
    //catch any errors
    .catch(function(err) {
        console.log(err);
    })
};


function logToFile(logText) {
    fs.appendFile('log.txt', "\n" + logText, function (err) {
        if (err) throw err;
    });
}

function recursion() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Want to search again?",
            name: "confirm",
            default: true
        }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.confirm) {
            askLIRI();
        } else {
            console.log("\nOk, see you later then!");
        }
    }); 
};


// TO DO:
    // add in error catching for URL = null

