import SpotifyWebApi from 'spotify-web-api-node';
import fs from 'fs';

var spotifyApi = new SpotifyWebApi({
    clientId: 'aad19679bf2e4f0f867447e17587fe1e',
    clientSecret: 'c13b5f227ebb4a609e0efeca826a099c',
    redirectUri: 'http://localhost:8888/callback'
  });
var access_token = "BQBZFmpyI_eBjlb7C4xY8BeQ3XmS-GwbX55fpm6mBczNcWKBXadfzNQpgrf3Et90X1vS2EQKR6yBBoV1MZ9d75WvsEHHrP6OGvRKfRDcxqrExCqzSvOJp0QqUyG9KDZfpfo8HzQGGtOCBckPcAF63GZdCQOrVOik4LPiY8t_NlRC1EUtFzi5bcyw6EgclUXBjLey9Pv1M09ifCRUOnYSPO_K3lGnuKS7DPNtnsu4GCxmlDGzUzTAARTmfQf1FQCmoz_v970swuwlgs5s2oUVJqPRGBV3pA"
spotifyApi.setAccessToken(access_token);

// const API_CALL_LIMIT = 20;

async function getTopTracks() {
    let savedTracks = "";
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
            // savedTracks.push(trackId)
            fs.writeFileSync('/Users/davidoke/Desktop/Programming/music-recommender/tracks.txt', JSON.stringify(trackName) + " : " + JSON.stringify(trackId) + "\n", { flag: 'a+' },err => {
                if (err) {
                  console.error(err);
                }
              });
        }
      }, function(err) {
        console.log('Something went wrong!', err);
      });
    
      return savedTracks;
}

async function getRecommendations(tracks) {
    var data = await spotifyApi.getRecommendations({
        seed_artists: "",
        seed_genres: "",
        seed_tracks: tracks
    }).then(function(data) {
        var tracks = data.body.tracks;
        for(var i = 0; i < tracks.length; i++) {
            let trackName = tracks.at(i).name;
            let trackId = tracks.at(i).uri;
            // savedTracks += trackId + ",";
            fs.writeFileSync('/Users/davidoke/Desktop/Programming/music-recommender/recommendations.txt', JSON.stringify(trackName) + " : " + JSON.stringify(trackId) + "\n", { flag: 'a+' },err => {
                if (err) {
                  console.error(err);
                }
              });
        }
      }, function(err) {
        console.log('Something went wrong!', err);
      });
}
var str = await getTopTracks();
console.log(str)
await getRecommendations(str);