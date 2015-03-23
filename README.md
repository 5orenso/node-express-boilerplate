# node-express-boilerplate
[![Build Status](https://travis-ci.org/5orenso/node-express-boilerplate.svg?branch=master)](https://travis-ci.org/5orenso/node-express-boilerplate)
[![Coverage Status](https://coveralls.io/repos/5orenso/node-express-boilerplate/badge.svg)](https://coveralls.io/r/5orenso/node-express-boilerplate)

## Yet another Node.js - Express boilerplate

This time with a template engine, unit tests, integration tests, code coverage, continuous integration, code analysis and a nice setup flow.


## Getting started

#### Prerequisite

```bash
$ npm install -g buster
$ npm install -g grunt
$ npm install -g istanbul
```

#### Clone repo and start server

To run the server in development mode:
```bash
git clone https://github.com/5orenso/node-express-boilerplate.git
cd node-express-boilerplate
npm install
./run-server.sh
```

This will restart the server every time a file has changed.


In addition to this I recommend using Grunt to watch your files and perform code analysis and run tests every time a file changes:
```bash
./run-watch.sh
```

Now, go ahead and add modules into the ./app/routes/web.js or add more routes to the ./app/server.js file.

