@realHellToupee
==========

A proud first release from artist Sofa King Awesome, 12.26.2015.

You can build your own twitter bot by taking this code and modifying it.

Requires [node](http://nodejs.org/) and [npm](http://npmjs.org/). You also need a Twitter App access token, consumer key, and associated secrets: https://dev.twitter.com/apps/new

(You'll need to add all that info to `helltoupee.js` before running the program. Don't worry - code is commented.)

Instead of putting the secrets into `helltoupee.js` directly (don't upload your secretes to github!) I used `fs` (part of the core Node.js API) to read these in from files in the same local directory as `helltoupee.js` for local development, and reference environment variables for deployment on `heroku`.

Code inspired by https://github.com/dariusk/metaphor-a-minute. Thanks Darius!

Check `packages.json` for dependencies. (I know, my node version is whack...might update it later, and it should work with the newest version of node without too much trouble.)

> npm install 

> node helltoupee.js
