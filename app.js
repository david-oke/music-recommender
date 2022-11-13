import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';
import { Console } from 'console';

var spotifyApi = new SpotifyWebApi({
    clientId: 'aad19679bf2e4f0f867447e17587fe1e',
    clientSecret: '',   // Hidden for GitHub
    redirectUri: 'http://localhost:8888/callback'
  });
var access_token = "" // Hidden for GitHub
spotifyApi.setAccessToken(access_token);


const OLD_NASSAU_ID = "spotify:track:5I009U28vJ5XbommnrsvAr"

async function getTopTracks() {
    let ret = []
    let savedTracks = "";
    let savedTracksNames = []
    var data = await spotifyApi.getMyTopTracks({
        limit: 5,
        time_range: "long_term",
        offset: 5
    }).then(function(data) {
        var tracks = data.body.items;
        for(var i = 0; i < tracks.length; i++) {
            let trackName = tracks.at(i).name;
            let trackId = tracks.at(i).uri.slice(14);
            savedTracks += trackId + ",";
            savedTracksNames.push(trackName);
            fs.writeFileSync('./tracks.txt', JSON.stringify(trackName) + " : " + JSON.stringify(trackId) + "\n", { flag: 'a+' },err => {
                if (err) {
                  console.error(err);
                }
              });
        }
      }, function(err) {
        console.log('Something went wrong!', err);
      });
      ret.push(savedTracks);
      ret.push(savedTracksNames);
      return ret;
}

async function getRecommendations(tracks) {
    let ret = [];
    let savedTracks = "";
    let savedTracksNames = [];
    let savedArtistNames = [];
    var data = await spotifyApi.getRecommendations({
        seed_artists: "",
        seed_genres: "",
        seed_tracks: "0w0BkzzY2JgYohvF9PYnCq"
    }).then(function(data) {
        var tracks = data.body.tracks;
        for(var i = 0; i < tracks.length; i++) {
            let trackName = tracks.at(i).name;
            let artistName = tracks.at(i).artists.at(0).name;
            let trackId = tracks.at(i).uri.slice(14);
            savedTracks += trackId + ",";
            savedTracksNames.push(trackName);
            savedArtistNames.push(artistName);
            fs.writeFileSync('./recommendations.txt', JSON.stringify(trackName) + " : " + JSON.stringify(trackId) + "\n", { flag: 'a+' },err => {
                if (err) {
                  console.error(err);
                }
              });
        }
      }, function(err) {
        console.log('Something went wrong!', err);
      });
    ret.push(savedTracks);
    ret.push(savedTracksNames);
    ret.push(savedArtistNames);
    return ret;
}

// Creates a playlist
async function createPlaylist(title, description, isPublic) {
    let playlistId = "";
    var data = await spotifyApi.createPlaylist(title, { 
        'description': description, 
        'public': isPublic 
    }).then(function(data) {
        console.log('Created playlist: ' + title);
        playlistId = data.body.id;
  }, function(err) {
        console.log('Something went wrong!', err);
  });
  return playlistId;
}

// Populates a playlist
async function populatePlaylist(playlistId, trackURIs) {
    await spotifyApi.addTracksToPlaylist(playlistId, trackURIs)
    .then(function(data) {}, function(err) { 
        console.log('Something went wrong!', err); 
    });
}

console.log("--------------Spotify Music Recommender----------------\n")
var topTracks = await getTopTracks();
var recommendations = await getRecommendations(topTracks[0]);
var recommendIds = recommendations[0];
recommendIds = recommendIds.slice(0, -1);
recommendIds = recommendIds.replaceAll(",", ",spotify:track:");
var str = "spotify:track:"
recommendIds = str.concat(recommendIds);
var idsArr = recommendIds.split(",");
idsArr.push(OLD_NASSAU_ID);

var playlistId = await createPlaylist("Recommended Songs", "We recommend you try these tracks", true);
await populatePlaylist(playlistId, idsArr);



console.log("Based on your listening activity, we recommend you try: ")
console.log("------------------------------------------------------\n")

for(var i = 0; i < recommendations[1].length; i++) {
    console.log(recommendations[1][i] + " by " + recommendations[2][i]);
}
console.log("Old Nassau" + " by " + "The Princeton Nassoons");

console.log("\n------------------------------------------------------\n")