/*
******************************************************
* @realHellToupee
* Built by artist Sofa King Awesome
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

//var stream = T.stream('statuses/sample')
var stream = T.stream('statuses/filter', { track: '@realDonaldTrump' })
var tweetText; 

stream.on('tweet', function (tweet) {
  var text = tweet['text'];
  var count = 0;
  var count2 = 0;
  while (true){
   
   // reject short tweets
   if (text.length < 50){
    count2++;
    console.log("skipping b/c short: " + count2 + '\n'); // debug statement
    continue;
   }
   
   // reject tweets that have hyperlinks
   if (text.indexOf('http') > -1){
      count++;
      //console.log(text);
      //console.log("skipping http: " + count + '\n');
      continue;
   } 
   
   // test for strings of interest
   var containsFlag = -1; 
   containsFlag += text.indexOf('trump') + text.indexOf('Trump') + text.indexOf('donald') + text.indexOf('Donald');
   if (containsFlag < 0){  
    continue;
   }

   // regex logic to swap words 

      // 'Trump' and all variations => 'WhISIS'
      // 'Make America Great Again' and all variations => 'Notice me, Senpai!'

   else{
    stream.stop(); // shutdown stream API, we've got what we need

    // strip @'s to avoid non-consensual replies
    var patt = /@/g;
    text = text.replace(patt, '');

    // change &amp; to &
    patt = /&amp;/;
    text = text.replace(patt, '&');
    
    // replace all trumps (not sure how to replace across a newline, e.g. "This text has Mr. \n Donald Trump")
    // this list is ordered in precedence
    patt = /realDonaldTrump/gi;
    text = text.replace(patt, 'WhISIS');

    patt = /Mr. Donald Trump/gi;
    text = text.replace(patt, 'WhISIS');

    patt = /The Donald/gi;
    text = text.replace(patt, 'WhISIS');

    patt = /Donald Trump/gi;
    text = text.replace(patt, 'WhISIS');

    patt = /trump/gi;
    text = text.replace(patt, 'WhISIS');

    patt = /make america great again/gi;
    text = text.replace(patt, 'Notice me, Senpai!');

    patt = /make america great/gi;
    text = text.replace(patt, 'Notice me, Senpai!');

    patt = /MakeAmericaGreatAgain/gi;
    text = text.replace(patt, 'Notice me, Senpai!');

    patt = /MakeAmericaGreat/gi;
    text = text.replace(patt, 'Notice me, Senpai!');

    break;
   }

  }

});


/*
******************************************************
* END two minute refresh loop
******************************************************
*/



/*
******************************************************
* to do
******************************************************
*/

/*
Make this tweet the first one and pin it:
RT @mitchellvii: Trump is the movement.
The movement is us.
Trump is us.
We are voting for ourselves.
@realDonaldTrump

To do:
- how will we post the message back to twitter? (REST API?)
- sometimes it just hangs and never gets a tweet...what's happening then? we need a timeout escape if no tweet is received
  where it closes and re-opens the stream
- how will we implement the two minute refresh rule? - see setInterval function in comments below
- how often should we scrub from trump's own twitter account? once every hour? should we signal this tweet as a WhISIS original?
    (perhaps a tweet before it says "Up next - a WhISIS original!")
- what should we do if the tweet is too long? (need a safety check for 140 chars)
- how are we going to deal with escape characters like: \'   and    \n  ?

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
