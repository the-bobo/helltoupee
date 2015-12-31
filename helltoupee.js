/*
******************************************************
* @realHellToupee
* Built by artist Sofa King Awesome
* v1 ship 12.26.2015
* Notice me senpai!
******************************************************
*/

var Twit = require('twit');
var fs = require('fs');
var http = require('http');

/*
******************************************************
* Setting up web frontend for heroku 
******************************************************
*/

function handleRequest (req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'}); 
  res.end('it is running\n'); 
}

function keepAlive(){
  http.createServer(handleRequest).listen(process.env.PORT || 5000);
  }
}

keepAlive();
setInterval(keepAlive, 60000);


/*
// tried to create a rich front page that auto-updated
// with latest tweets, but this crashed on heroku for whatever reason
http.createServer(function (request, response) {

  var filePath = './index.html';
  var contentType = 'text/html';
  var content;
  fs.readFileSync(filePath, function(error, con) {
    content = con;
    console.log(error);
  });
  //response.writeHead(200, { 'Content-Type': contentType });
  response.writeHead(200);
  response.end(content);
  //response.end(content, 'utf-8');

}).listen(5000);
*/


/*
******************************************************
* Initial twitter setup
******************************************************
*/

// declare variables to hold twitter app secrets
// file pathing done for OSX / Linux, may need to change for Windows
// perhaps using the path module in Node.js could make this cross-platform easier

/* scrub secrets from localstore
var consumer_key = fs.readFileSync('./consumerkey.txt', 'utf-8');
var consumer_secret = fs.readFileSync('./consumersecret.txt', 'utf-8');
var access_token = fs.readFileSync('./accesstoken.txt', 'utf-8');
var access_token_secret = fs.readFileSync('./accesstokensecret.txt', 'utf-8');
*/

// scrub secrets from environment variables for cloud deploy
var consumer_key = process.env.CONSUMERKEY;
var consumer_secret = process.env.CONSUMERSECRET;
var access_token = process.env.ACCESSTOKEN;
var access_token_secret = process.env.ACCESSTOKENSECRET;

// setup Twit with our secrets
var T = new Twit({
  consumer_key: consumer_key, 
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});
var text; // to hold tweet text
var lastText = ''; // to cache last tweet
var runCounter = 0; // to measure overall runs


/*
******************************************************
* BEGIN two minute refresh loop
******************************************************
*/

function harvestTweets(){
  runCounter++;
  var stream = T.stream('statuses/filter', { track: '@realDonaldTrump,Trump' })

  stream.on('tweet', function (tweet) {
    text = tweet['text'];
    var httpcount = 0;
    var shortcount = 0;

   // reject short tweets, ask for another
   if (text.length < 50){
    shortcount++;
    console.log("skipping b/c short: " + shortcount + '\n'); // debug statement
    return;
  }

   // reject tweets that have hyperlinks - was rejecting too many, turned it off
   /*
   if (text.indexOf('http') > -1){
      httpcount++;
      console.log(text);
      console.log("skipping http: " + httpcount + '\n');
      return;
   } 
   */

   // test for strings of interest
   var containsFlag = -1; 
   containsFlag += text.indexOf('trump')+1 + text.indexOf('Trump')+1 + text.indexOf('donald')+1 + text.indexOf('Donald')+1;
   // containsFlag is acting as a logical OR, where a value >= 0 is TRUE
   if (containsFlag < 0){  
    return;
  }

   // regex logic to swap words 
      // 'Trump' and all variations => 'WhISIS'
      // 'Make America Great Again' and all variations => 'Notice me, Senpai!'
  else{
    if (lastText === text){
      // this tweet is the same as the last one we posted,
      // ask for another
      return;
    }
    
    console.log('Unedited tweet ' + runCounter + ': ' + text);
    stream.stop(); // shutdown stream API, we've got what we need
    lastText = text; // cache this tweet

    // strip @'s to avoid non-consensual replies
    var patt = /@/g;
    text = text.replace(patt, '');

    // change &amp; to &
    patt = /&amp;/g;
    text = text.replace(patt, '&');

    // change &gt; to >
    patt = /&gt;/g;
    text = text.replace(patt, '>')

    // change &lt; to <
    patt = /&lt;/g;
    text = text.replace(patt, '<')

    // change &#039 to '
    patt = /&#039/g;
    text = text.replace(patt, '\'');
    
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

    console.log('Edited tweet ' + runCounter + ': ' + text);

    // post the tweet

    T.post('statuses/update', { status: text }, function(err, data, response) {
      console.log(data); // for some reason taking this line out makes the post not work...
      if (typeof err !== 'undefined'){
        console.log ('######### Error Posting Tweet ######### ' + err + '\n');
      }
    });

    return;
  }

});
}

harvestTweets();
setInterval(harvestTweets, 120000);


/*
******************************************************
* END two minute refresh loop
******************************************************
*/


/*
******************************************************
* Favorite RT's of Me (Every 5 hours)
******************************************************
*/

function favRTs () {
  T.get('statuses/retweets_of_me', {}, function (e,r) {
    for(var i=0;i<r.length;i++) {
      T.post('favorites/create/'+r[i].id_str,{},function(){});
    }
    console.log('harvested some RTs'); 
  });
}


setInterval(function() {
  try {
    favRTs();
  }
  catch (e) {
    console.log(e);
  }
},60000*60*5);



/*
******************************************************
* to do
******************************************************
*/

/*

To do:
-X how will we post the message back to twitter? (REST API?)
-X sometimes it just hangs and never gets a tweet...what's happening then? we need a timeout escape if no tweet is received
  where it closes and re-opens the stream - we'll just wait for the next 2 minute interval, opening a new stream connection
  closes the old one
-X how will we implement the two minute refresh rule? - see setInterval function in comments below
- how often should we scrub from trump's own twitter account? once every hour? should we signal this tweet as a WhISIS original?
    (perhaps a tweet before it says "Up next - a WhISIS original!")
- what should we do if the tweet is too long? (need a safety check for 140 chars)
- how are we going to deal with escape characters like: \'   and    \n  ?


// date function not needed if using streaming API
// useful for REST API searching
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

*/
