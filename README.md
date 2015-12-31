# node-express-boilerplate
[![Build Status](https://travis-ci.org/5orenso/node-express-boilerplate.svg?branch=master)](https://travis-ci.org/5orenso/node-express-boilerplate)
[![Coverage Status](https://coveralls.io/repos/5orenso/node-express-boilerplate/badge.svg)](https://coveralls.io/r/5orenso/node-express-boilerplate)

## Yet another Node.js - Express boilerplate

This time with a template engine, unit tests, integration tests, code coverage, continuous integration, code analysis, code style and a nice setup flow.

Helper modules in use:

__JSHint__
A tool that helps to detect errors and potential problems in your JavaScript code.

__Grunt__
The Javascript task runner. In one word: automation. The less work you have to do when performing repetitive tasks like minification, compilation, unit testing, linting, etc, the easier your job becomes.

__Buster.js__
A browser JavaScript testing toolkit. It does browser testing with browser automation (think JsTestDriver), QUnit style static HTML page testing, testing in headless browsers (PhantomJS, jsdom), and more.

__JSCS__
JSCS is a code style linter for programmatically enforcing your style guide.

__Istanbul__
A Javascript code coverage tool written in JS.

__Travis__
Travis CI is a hosted continuous integration service. It is integrated with GitHub and offers first class support for many languages.

__Coveralls.io__
Coveralls is a web service to help you track your code coverage over time, and ensure that all your new code is fully covered.


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

### HOWTO upgrade dev environment
```bash
npm install buster --save-dev
npm install buster-istanbul --save-dev
npm install grunt --save-dev
npm install grunt-buster --save-dev
npm install grunt-contrib-jshint --save-dev
npm install grunt-contrib-nodeunit --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-coveralls --save-dev
npm install grunt-jscs --save-dev
npm install grunt-nodemon --save-dev
npm install grunt-shell --save-dev
```

### Howto upgrade modules
```bash
$ npm install -g npm-check-updates
$ ncu -u
$ npm install --save --no-optional
```
