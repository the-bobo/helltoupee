@realHellToupee
==========

Code forked from https://github.com/dariusk/metaphor-a-minute. Thanks Darius!

You can build your own twitter bot by taking this code and modifying it.

Requires [node](http://nodejs.org/) and [npm](http://npmjs.org/). You also need a Twitter App access token, consumer key, and associated secrets: https://dev.twitter.com/apps/new

(You'll need to add all that info to helltoupee.js before running the program. Don't worry - code is commented.)

Instead of putting the secrets into helltoupee.js directly (don't upload your secretes to github!) I used *fs* (part of the core Node.js API) to read these in from files in the same local directory as helltoupee.js.

> npm install node-restclient@0.0.1

> npm install twit@1.1.6

> npm install express@2.5.9

> node helltoupee.js
