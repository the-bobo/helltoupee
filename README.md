[@realHellToupee](https://twitter.com/realHellToupee)
==========

A proud first release from artist Sofa King Awesome, 12.26.2015. https://twitter.com/realHellToupee

You can build your own twitter bot by taking this code and modifying it. Current version strips `@`'s to avoid accidental retweets. See below for implementation details.

@realHellToupee  
*2015*  
Sofa King Awesome  

Node.js on Heroku.  
On loan by the artist, to the public.

Inspired by the lovely [Trevor Noah](https://twitter.com/trevornoah) and [Hasan Minhaj](https://twitter.com/hasanminhaj) skit, ["Donald Trump: The White ISIS,"](http://www.cc.com/video-clips/0org9p/the-daily-show-with-trevor-noah-donald-trump--the-white-isis) this twitter bot scans for new tweets mentioning Donald Trump every two minutes. It replaces all instances of `Trump` with `WhISIS` ("why-sis") and `Make America Great Again` with `Notice me, Senapi!`. The resulting retweets are both eerie and comical. An overidentification with racist fascism reminds us of the stakes and twisted sincerity of participants on the one hand, while an overidientification with self-referential meme culture reminds us that the Internet is serious business after all.

Requires [node](http://nodejs.org/) and [npm](http://npmjs.org/). You also need a Twitter App access token, consumer key, and associated secrets: https://dev.twitter.com/apps/new

You'll need to add all that info to `helltoupee.js` before running the program. Don't worry - code is commented.

Instead of putting the secrets into `helltoupee.js` directly (don't upload your secretes to github!) I used `fs` (part of the core Node.js API) to read these in from files in the same local directory as `helltoupee.js` for local development, and referenced environment ("config") variables for deployment on `heroku`.

Code inspired by https://github.com/dariusk/metaphor-a-minute. Thanks Darius!

Check `packages.json` for dependencies. 

> npm install 

> node helltoupee.js
