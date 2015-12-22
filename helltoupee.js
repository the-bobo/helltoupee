/*
******************************************************
* @realHellToupee
* Built by Sofa King Awesome
* Notice me senpai!
******************************************************
*/

var restclient = require('node-restclient');
var Twit = require('twit');
var fs = require('fs');

/*
var express = require('express');
var http = require('http');
var app = require('express');
//var server = http.createServer(app);

// I deployed to Nodejitsu, which requires an application to respond to HTTP requests
// If you're running locally you don't need this, or express at all.
app.get('/', function(req, res){
    res.send('Hello world.');
});
app.listen(3000);
*/

/*
******************************************************
* Initial twitter setup
******************************************************
*/

// declare variables to hold twitter app secrets
// file pathing done for OSX / Linux, may need to change for Windows
// perhaps using the path module in Node.js could make this cross-platform easier

var consumer_key = fs.readFileSync('./consumerkey.txt', 'utf-8');
var consumer_secret = fs.readFileSync('./consumersecret.txt', 'utf-8');
var access_token = fs.readFileSync('./accesstoken.txt', 'utf-8');
var access_token_secret = fs.readFileSync('./accesstokensecret.txt', 'utf-8');

// setup Twit with our secrets
var T = new Twit({
  consumer_key: consumer_key, 
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});

/*
******************************************************
* BEGIN two minute refresh loop
******************************************************
*/

var flag = 0;

// scrub today's date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10){
  dd='0'+dd
    } 
if(mm<10){
  mm='0'+mm
    } 

var today = yyyy + '-' + mm + '-' + dd;

/* REST API search
T.get('search/tweets', { q: '@realDonaldTrump since:' + today, count: 100 }, function(err, data, response) {
  console.log(data);
});
*/

//var stream = T.stream('statuses/sample')
var stream = T.stream('statuses/filter', { track: '@realDonaldTrump' })
var tweetText; 

stream.on('tweet', function (tweet) {
  console.log('####################\n####################');
  console.log(tweet['text']);
  flag = 1;
});


if (flag === 1){
  stream.stop();
}


/*
******************************************************
* regex logic
******************************************************
*/

/*
Make this tweet the first one:
RT @mitchellvii: Trump is the movement.
The movement is us.
Trump is us.
We are voting for ourselves.

@realDonaldTrump

Types of tweets: https://support.twitter.com/articles/119138?lang=en
Automation guidelines: https://support.twitter.com/articles/76915?lang=en
Steraming message types: https://dev.twitter.com/streaming/overview/messages-types
Streaming API request paramters: https://dev.twitter.com/streaming/overview/request-parameters
Processing streaming messages: https://dev.twitter.com/streaming/overview/processing

samples:
'Patriot. Love my Country and Flag. \nAnti-Illegal Alien,  Anti-Insider Trading by Elected Officials. Trump 100% Make America Great Again!'
=> 'Patriot. Love my Country and Flag. \nAnti-Illegal Alien, Anti-Insider Trading by Elected Officials. WhISIS 100% Notice me Senpai!''

'RT @sjh2222: @CindyBlackwel12 @realDonaldTrump MERRY CHRISTMAS!'
=> 'RT sjh2222: CindyBlackwel12 WhISIS MERRY CHRISTMAS!'
  - have to strip all @'s to avoid tweeting at someone without their consent

'@realDonaldTrump @JebBush YOU ARE A HORRIBLE PERSON DONALD TRUMP'
=> 'WhISIS JebBush YOU ARE A HORRIBLE PERSON WhISIS'

'@theblaze @PerezHilton @realDonaldTrump so @theblaze sides with the Far Left in its hatred for @realDonaldTrump'
=> 'theblaze PerezHilton WhISIS so theblaze sides with the Far Left in its hatred for WhISIS'

this is one from Trump's twitter - maybe should do one of these every so often? every tenth one?:
'"@officialjtw: @realDonaldTrump You\'re iconic! You are going down in the history books! #trump2016"  So nice, thank you.',

=> '"officialjtw: WhISIS You\'re iconic! You are going down in the history books! #WhISIS2016"  So nice, thank you.',
  - how are we going to deal with escape characters like: \'   and    \n  ?

want to ignore ones like this - just his screen name and a link - or maybe not:
'@realDonaldTrump https://t.co/fv3qYDtBM2'
=> 'WhISIS https://t.co/fv3qYDtBM2'

To do:
- how do we get the tweet from the stream API?
- why did the stream API shut down when I started scrolling?
- how often should we scrub from trump's own twitter account? once every hour? should we signal this tweet as a WhISIS original?
    (perhaps a tweet before it says "Up next - a WhISIS original!")
- how will we post the message back to twitter? (REST API?)
- what should we do if the tweet is too long? (need a safety check for 140 chars)

- how are we going to deal with escape characters like: \'   and    \n  ?
- have to strip all @'s to avoid tweeting at someone without their consent
- things to change to WhISIS: 
      -trump or Trump or TRUMP (anywhere in string, e.g., #trump2016 => #WhISIS2016, #trumptrain => #WhISIStrain)
      -donald trump or DONALD TRUMP or Donald Trump
      -Mr. Trump or mr. trump etc. (basically all of these are case insensitive)
      -the donald or The Donald or the Donald or The donald or THE DONALD
- things to change to Notice me, Senpai! (all case variations)
      -make america great again 
      -make america great (only apply this rule if it is missing 'again')
      -MakeAmericaGreatAgain 
      -MakeAmericaGreat (only apply this rule if it is missing 'again')

*/


/*
******************************************************
* END two minute refresh loop
******************************************************
*/





/*

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
*/
