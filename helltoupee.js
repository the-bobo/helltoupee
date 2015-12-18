var restclient = require('node-restclient');
var Twit = require('twit');
var app = require('express').createServer();
var fs = require('fs');

// I deployed to Nodejitsu, which requires an application to respond to HTTP requests
// If you're running locally you don't need this, or express at all.
app.get('/', function(req, res){
    res.send('Hello world.');
});
app.listen(3000);

// declare variables to hold twitter app secrets
var consumer_key;
var consumer_secret;
var access_token;
var access_token_secret;

// scrub twitter app secrets from local utf8 text files
// file pathing done for OSX / Linux, may need to change for Windows
// perhaps using the path module in Node.js could make this cross-platform easier

fs.readFile('./consumerkey.txt', 'utf8', function(err, data){
  if (err){
    console.log(err);
    process.exit(1);
  }
  consumer_key = data;
})

fs.readFile('./consumersecret.txt', 'utf8', function(err, data){
  if (err){
    console.log(err);
    process.exit(1);
  }
  consumer_secret = data;
})

fs.readFile('./accesstoken.txt', 'utf8', function(err, data){
  if (err){
    console.log(err);
    process.exit(1);
  }
  access_token = data;
})

fs.readFile('./accesstokensecret.txt', 'utf8', function(err, data){
  if (err){
    console.log(err);
    process.exit(1);
  }
  access_token_secret = data;
})

// insert the twitter app secrets
var T = new Twit({
  consumer_key: consumer_key, 
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});


var statement =   "";

// insert your Wordnik API info below
var getNounsURL = "http://api.wordnik.com/v4/words.json/randomWords?" +
                  "minCorpusCount=1000&minDictionaryCount=10&" +
                  "excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&" +
                  "hasDictionaryDef=true&includePartOfSpeech=noun&limit=2&maxLength=12&" +
                  "api_key=______YOUR_API_KEY_HERE___________";

var getAdjsURL =  "http://api.wordnik.com/v4/words.json/randomWords?" +
                  "hasDictionaryDef=true&includePartOfSpeech=adjective&limit=2&" + 
                  "minCorpusCount=100&api_key=______YOUR_API_KEY_HERE___________";


function makeMetaphor() {
  statement = "";
  restclient.get(getNounsURL,
  function(data) {
    first = data[0].word.substr(0,1);
    first2 = data[1].word.substr(0,1);
    article = "a";
    if (first === 'a' ||
        first === 'e' ||
        first === 'i' ||
        first === 'o' ||
        first === 'u') {
      article = "an";
    }
   article2 = "a";
    if (first2 === 'a' ||
        first2 === 'e' ||
        first2 === 'i' ||
        first2 === 'o' ||
        first2 === 'u') {
      article2 = "an";
    }

    var connector = "is";
    switch (Math.floor(Math.random()*12)) {
      case 0:
        connector = "of";
      break;
      case 1:
        connector = "is";
      break;
      case 2:
        connector = "is";
      break;
      case 3:
        connector = "considers";
      break;
      case 4:
        connector = "is";
      break;
    }

    statement += article + " " + data[0].word + " " + connector + " " + article2 + " " + data[1].word;

    restclient.get(
      getAdjsURL,
      function(data) {
        var connector = " and";
        switch (Math.floor(Math.random()*8)) {
          case 0:
            connector = ", not";
          break;
          case 1:
            connector = ", yet";
          break;
          case 2:
            connector = " but";
          break;
          case 3:
            connector = ",";
          break;
          case 4:
            connector = ", but not";
          break;
        }
        output = data[0].word + connector + " " + data[1].word;
        statement = statement + ": " + output;
        console.log(statement);
        T.post('statuses/update', { status: statement}, function(err, reply) {
          console.log("error: " + err);
          console.log("reply: " + reply);
        });
      }    
    ,"json");
  }    
  ,"json");
}

function favRTs () {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i=0;i<r.length;i++) {
      T.post('favorites/create/'+r[i].id_str,{},function(){});
    }
    console.log('harvested some RTs'); 
  });
}

// every 2 minutes, make and tweet a metaphor
// wrapped in a try/catch in case Twitter is unresponsive, don't really care about error
// handling. it just won't tweet.
setInterval(function() {
  try {
    makeMetaphor();
  }
 catch (e) {
    console.log(e);
  }
},120000);

// every 5 hours, check for people who have RTed a metaphor, and favorite that metaphor
setInterval(function() {
  try {
    favRTs();
  }
 catch (e) {
    console.log(e);
  }
},60000*60*5);
