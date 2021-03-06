# node-express-boilerplate
[![Build Status](https://travis-ci.org/5orenso/node-express-boilerplate.svg?branch=master)](https://travis-ci.org/5orenso/node-express-boilerplate)
[![Coverage Status](https://coveralls.io/repos/5orenso/node-express-boilerplate/badge.svg)](https://coveralls.io/r/5orenso/node-express-boilerplate)
[![GitHub version](https://badge.fury.io/gh/5orenso%2Fnode-express-boilerplate.svg)](https://badge.fury.io/gh/5orenso%2Fnode-express-boilerplate)

## Yet another Node.js - Express boilerplate

This time with a template engine (Swig), Preact, unit tests, integration tests, code coverage, continuous integration, code analysis, code style and a nice setup flow.

Helper modules in use:

__Jest__
A browser JavaScript testing toolkit. Jest is used by Facebook to test all JavaScript code including React applications. One of Jest's philosophies is to provide an integrated "zero-configuration" experience.

__ESLint__
ESLint is a code style linter for programmatically enforcing your style guide.

__Istanbul__
A Javascript code coverage tool written in JS.

__Travis__
Travis CI is a hosted continuous integration service. It is integrated with GitHub and offers first class support for many languages.

__Coveralls.io__
Coveralls is a web service to help you track your code coverage over time, and ensure that all your new code is fully covered.

__Retire__
Scanner detecting the use of JavaScript libraries with known vulnerabilities.

## Getting started

#### Prerequisite

```bash
$ npm install -g nodemon
$ npm install -g eslint
```

#### Clone repo and start server

To run the server in development mode:
```bash
$ git clone https://github.com/5orenso/node-express-boilerplate.git
$ cd node-express-boilerplate
$ npm install
$ npm run start
```

Now you can browse your shiny new webpage. Open your favorite browser and navigate to one of these pages:

- http://localhost:8888/index.html
- http://localhost:8888/blog.html
- http://localhost:8888/readme
- http://localhost:8888/example/index.html
- http://localhost:8888/example/blog.html
- http://localhost:8888/example/readme

This will restart the server every time a file has changed.

In addition to this I recommend using Grunt to watch your files and perform code analysis and run tests every time a file changes:
```bash
$ ./run-watch.sh
```

Now, go ahead and add modules into the ./app/routes/web.js or add more routes to the ./app/server.js file.

### HOWTO check the test coverage
```bash
$ npm test
$ open coverage/lcov-report/index.html
```

### HOWTO fix eslint issues
```bash
$ eslint --fix lib/utilities.js
```

### Howto update NPM module

1. Bump version inside `package.json`
2. Push all changes to Github.
3. Push all changes to npmjs.com: `$ bash ./npm-release.sh`.

### Howto check for vulnerabilities in modules
```bash
# Install Node Security Platform CLI
$ npm install nsp --global  

# From inside your project directory
$ nsp check  
```

### Howto upgrade modules
```bash
$ sudo npm install -g npm-check-updates
$ ncu -u -a
$ npm install --no-optional
```

### Versioning
For transparency and insight into the release cycle, releases will be
numbered with the follow format:

<major>.<minor>.<patch>

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.


## Contributions and feedback:

We ❤️ contributions and feedback.

If you want to contribute, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) file.

If you have any question or suggestion create an issue.

Bug reports should always be done with a new issue.


## Other Resources

* [AWS Basic setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-base)
* [AWS Lambda boilerplate](https://github.com/5orenso/aws-lambda-boilerplate)
* [Automated AWS Lambda update](https://github.com/5orenso/aws-lambda-autodeploy-lambda)
* [AWS API Gateway setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-api-gateway)
* [AWS IoT setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-iot)
