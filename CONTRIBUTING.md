Getting Started
----
We would :heart: to have pull requests from you. So here is how to start development with Node Express Boilerplate.

First fork and clone the repo:
````bash
git clone git@github.com:your-username/node-express-boilerplate.git
````

Then run this to set it all up:
```bash
$ cd node-express-boilerplate
$ npm install
$ grunt run
```

In addition to this I recommend using Grunt to watch your files and perform code analysis and run tests every time a
file changes:
```bash
$ grunt watch
```

You are now ready to start doing your changes.


Testing
----
Node Express Boilerplate uses Grunt and Buster.js to run test. Take a look in the test directory and always add tests
to your changes.


Changes
----
If you want to do any changes please [create an issue](https://github.com/5orenso/node-express-boilerplate/issues/new).

Bug fixes is of course welcome at any time :+1:


Pull Requests
----
So you are ready to make a PR? Great! :smile:

But first make sure you have checked some things.

* Your code should follow the code style guide provided by [.eslintrc](https://github.com/5orenso/node-express-boilerplate/blob/master/.eslintrc.json) by running ``grunt`` or ``grunt watch``
* Don't commit build changes. No `dist/` or `bin/` changes in the PR.
