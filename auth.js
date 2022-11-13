import axios from 'axios';
/* 
------  Need to authenticate first:
------  Run requestAuthorization() to get url
------  go to url in browser and copy code (follows code="")
------  change variable in line 32 and use code in curl command (line 108)
------  run curl command to get access token
------  update access token in app.js and run node app

Youtube Tutorials:

https://www.youtube.com/watch?v=-FsFT6OwE1A
https://www.youtube.com/watch?v=1vR3m0HupGI

TODO:
-> Try to automate refreshing token process
*/
const clientId = 'aad19679bf2e4f0f867447e17587fe1e';
const clientSecret = 'c13b5f227ebb4a609e0efeca826a099c';

var redirectURI = "http://localhost:8888/callback"
var encodedRedirectURI = "http%3A%2F%2Flocalhost%3A8888%2Fcallback"

const authorize = "https://accounts.spotify.com/authorize"
const TRACKS = "https://api.spotify.com/v1/me/tracks"
const TOKEN = 'https://accounts.spotify.com/api/token'

function requestAuthorization() {
    let url = authorize;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodedRedirectURI;
    url += "&scope=user-follow-modify%20playlist-read-collaborative%20user-top-read%20playlist-modify-public%20user-library-modify%20user-follow-read%20user-library-read%20playlist-read-private%20playlist-modify-private"
    console.log(url);
}

var code = "AQBgIYH2KtMgik59lpLLcJUjefJOeAjbn2tVmZvbhZKgtc3spjG5LjuOYF6mDVb-daiP0jdvu8Ea76qfSyxN-gs844hNr7oW6C3Ok6-ctH-T8ZHbnnOxFAo1okCvlQDDE7nwwhe7CquEX1gyN-UeqZAi7su-9v5TvK-NjwKLVvpsifY-PqGLH-rsJTaZ6OSOrXcDubWAV7ZciWaQ6_wVXFzv3RLCDUsMAa1tedNV4A0kHOatcg1VmJPW3ObzYKriUDUeXzLdaXoAmOF6AbcS1Kkl__BAOrS5EEvX0U8kP7fRz4m9vHty3OCwOzijjIWpQ9CdQworVHc6JZjJhvBNauI7632mDmDPiiiUpbFMX1_TwVKADqnuzXecpwqwjO4QcWTeg7WJAO5MwiU-SluF_3k8wyB6G9qTQmw_R69daP1DAzA4"
var access_token = "BQAHVHZE1LSZyzLH_GgCa1-8MiqLwKYYQMkP2xFuvczUghB8jHhnXpQ9yEknlbeDgRNMzcKV_m6yF12qfOVVJ_9lAKcK1nri0S5iPqqJdNfpPifaQmR1eDyVsuD3hPcxVAkeTKe-904Wn5OBScPXKmphi0ztN09i5mo6lY5_O4tDuwKKLG-r9OOkgW47SLuNAAZOf6tMJ3AG2RDtaPrJoxQvj1pb4vD4DSSGevbR4WWFoaS1kXlmRpJg8EIcGI6j-Hr3MgUV-G5uY7XRZl41U41bIrmlCA"
var spotify_id = "david_oke"
var refresh_token = "AQCUduRX-wtZ2csKnVDWUMn3CzFe7Ea5hnKkHCiSpI9Ze0Ye-OXmO0YaobzyduGr-VEkZn1W5HzwNXa_jIEPSaQTHZA_HF0pPKJs_uqDjk5Ntv_bx7xhl8yvSCVBAZpk0cA"


function callAuthorizationApi (body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse
}

function refreshAccessToken() {
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&clientId=" + clientId;
    callAuthorizationApi(body);
}

function fetchAccessToken() {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri" + encodedRedirectURI;
    callAuthorizationApi(body);
}

// Parses authorization response request for access token and refresh token
function handleAuthorizationResponse(data) {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if (data.access_token != undefined) {
            access_token = data.access_token;
        }
        if (data.refresh_token != undefined) {
            refresh_token = data.refresh_token;
        }
    }
    else {
        console.log(this.responseText);
    }
}

function handleTracksResponse() {
    if (this.status == 200) {
        var data = JSON.parse(this.responseText);
        console.log(data);
    }
    else if (this.status == 401) {
        refreshAccessToken();
    }
    else {
        console.log(this.responseText);
    }
}

function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body)
    xhr.onload(callback);
}

function doTheTing() {
    callApi("GET", TRACKS, null, handleTracksResponse)
}


async function getTracks() {
    request.get(TRACKS, { 
        method: 'GET', 
        headers: { 'Authorization' : 'Bearer ' + access_token },
        limit: 3,
        offset: 20
    }, (err, res, body) => {
        if (err) { 
            return console.log(err)
        }
        console.log(body);
    });
}

async function getSaved() {
    axios.get(TRACKS, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + access_token },
        limit: 3,
    }).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    })
}

requestAuthorization();
// doTheTing();



// curl -H "Authorization: Basic YWFkMTk2NzliZjJlNGYwZjg2NzQ0N2UxNzU4N2ZlMWU6YzEzYjVmMjI3ZWJiNGE2MDllMGVmZWNhODI2YTA5OWM=" -d grant_type=authorization_code -d code=AQBgIYH2KtMgik59lpLLcJUjefJOeAjbn2tVmZvbhZKgtc3spjG5LjuOYF6mDVb-daiP0jdvu8Ea76qfSyxN-gs844hNr7oW6C3Ok6-ctH-T8ZHbnnOxFAo1okCvlQDDE7nwwhe7CquEX1gyN-UeqZAi7su-9v5TvK-NjwKLVvpsifY-PqGLH-rsJTaZ6OSOrXcDubWAV7ZciWaQ6_wVXFzv3RLCDUsMAa1tedNV4A0kHOatcg1VmJPW3ObzYKriUDUeXzLdaXoAmOF6AbcS1Kkl__BAOrS5EEvX0U8kP7fRz4m9vHty3OCwOzijjIWpQ9CdQworVHc6JZjJhvBNauI7632mDmDPiiiUpbFMX1_TwVKADqnuzXecpwqwjO4QcWTeg7WJAO5MwiU-SluF_3k8wyB6G9qTQmw_R69daP1DAzA4 -d redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fcallback https://accounts.spotify.com/api/token
// curl -H "Authorization: Basic YWFkMTk2NzliZjJlNGYwZjg2NzQ0N2UxNzU4N2ZlMWU6YzEzYjVmMjI3ZWJiNGE2MDllMGVmZWNhODI2YTA5OWM=" -d grant_type=refresh_token -d refresh_token=AQCUduRX-wtZ2csKnVDWUMn3CzFe7Ea5hnKkHCiSpI9Ze0Ye-OXmO0YaobzyduGr-VEkZn1W5HzwNXa_jIEPSaQTHZA_HF0pPKJs_uqDjk5Ntv_bx7xhl8yvSCVBAZpk0cA -d code=AQBgIYH2KtMgik59lpLLcJUjefJOeAjbn2tVmZvbhZKgtc3spjG5LjuOYF6mDVb-daiP0jdvu8Ea76qfSyxN-gs844hNr7oW6C3Ok6-ctH-T8ZHbnnOxFAo1okCvlQDDE7nwwhe7CquEX1gyN-UeqZAi7su-9v5TvK-NjwKLVvpsifY-PqGLH-rsJTaZ6OSOrXcDubWAV7ZciWaQ6_wVXFzv3RLCDUsMAa1tedNV4A0kHOatcg1VmJPW3ObzYKriUDUeXzLdaXoAmOF6AbcS1Kkl__BAOrS5EEvX0U8kP7fRz4m9vHty3OCwOzijjIWpQ9CdQworVHc6JZjJhvBNauI7632mDmDPiiiUpbFMX1_TwVKADqnuzXecpwqwjO4QcWTeg7WJAO5MwiU-SluF_3k8wyB6G9qTQmw_R69daP1DAzA4 -d redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fcallback https://accounts.spotify.com/api/token


// { "access_token":"BQBHvh1Cavm0ah9NsrqgaVrnqp9p4akdGhldV0sh0MGIDJM9hBIYwRt8p0WVTkFp9g_L8S6Z-AjMftKOtkik12z65jVaFfOLF1oYZa9yjXTykb_folvDeQGNiJwx-scsEIH1Hv7l7G5Wxvie609RSoqbwXArXt4N3bPqiBxYJG5q5pRvqBEWj6wWbOxmfD0i6hmndacnD-pCnCyJFJbmFTsqmLVhBWtbvq5jM--J5lDZbQLRjF3B_U0lKfOfpFeuGNEtTzQkF4pCE7UE0Fac_Zq06NFtzw","token_type":"Bearer","expires_in":3600,"refresh_token":"AQDI6c9C1zQgOgxp2tA56DW3_sHSbK270RwJDz4ZXafEC5K7GLkgzQTJ6_FdZvwLkpfxhhCdwM8Iof--_bqW9Shg120hrnOLPPEfKw3HgtNYRRFvfBhbAxE1rGOYNcfv528","scope":"playlist-read-private playlist-read-collaborative user-follow-modify user-library-read user-library-modify user-follow-read playlist-modify-private playlist-modify-public user-top-read"}%     
