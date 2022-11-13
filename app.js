import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';
import { Console } from 'console';

var spotifyApi = new SpotifyWebApi({
    clientId: 'aad19679bf2e4f0f867447e17587fe1e',
    clientSecret: 'c13b5f227ebb4a609e0efeca826a099c',
    redirectUri: 'http://localhost:8888/callback'
  });
var access_token = "BQCyH_k1AJXeR5eZiEHOuKF8BPtbzFO45j62HN2aarYfI_gXLkP_zbu9H1tTw70JalWRZPDEcdDtkL4MjUyS-e408DUcOIlGrGmKM0JDT3FOkhQ0P94ETr5Jmsfyhf3dW16uQqD5Az1btnruOAIQ9Z0_8BV8JG5QAYqtEcE6FdwT24zuoVcQDB75hOESYElfYDPU8Uy55cqc0Ao7ah02vO3b5tdmkbdZy85RVV9oPnY98XF5gN5U7sWVcjoZveziuY_RPdxK5uKQ0zPQ0Z-PLQ9CdzQoHA"
spotifyApi.setAccessToken(access_token);

// const API_CALL_LIMIT = 20;

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
            fs.writeFileSync('/Users/davidoke/Desktop/Programming/music-recommender/tracks.txt', JSON.stringify(trackName) + " : " + JSON.stringify(trackId) + "\n", { flag: 'a+' },err => {
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
            fs.writeFileSync('/Users/davidoke/Desktop/Programming/music-recommender/recommendations.txt', JSON.stringify(trackName) + " : " + JSON.stringify(trackId) + "\n", { flag: 'a+' },err => {
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

var topTracks = await getTopTracks();
var recommendations = await getRecommendations(topTracks[0]);

console.log("Based on your listening activity, we recommend you try: ")
console.log("------------------------------------------------------\n")

for(var i = 0; i < recommendations[1].length; i++) {
    console.log(recommendations[1][i] + " by " + recommendations[2][i]);
}

console.log("\n------------------------------------------------------\n")