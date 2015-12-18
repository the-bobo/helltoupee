@realHellToupee
==========

Code forked from https://github.com/dariusk/metaphor-a-minute. Thanks Darius!

You can build your own twitter bot by taking this code and modifying it.

Requires [node](http://nodejs.org/) and [npm](http://npmjs.org/). You also need a Twitter App access token, consumer key, and associated secrets: https://dev.twitter.com/apps/new

(You'll need to add all that info to helltoupee.js before running the program. Don't worry - code is commented.)

Instead of putting the secrets into helltoupee.js directly (don't upload your secretes to github!) I used *fs* (part of the core Node.js API) to read these in from files in the same local directory as helltoupee.js.

Note that these commands are for OSX. Note that they do NOT take the form `sudo npm install -g packageName`, unlike the tpyically advised `sudo npm update -g` command for OSX.

> npm install node-restclient

> npm install twit

> npm install express

> npm install fs

> node helltoupee.js
