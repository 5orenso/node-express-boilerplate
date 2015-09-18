#!/bin/bash

echo 'You should probably do this first:'
echo '1. Generate a new repo on github.com.'
echo '2. Clone repo to you project home dir.'

echo '3. Enter path of new repo without trailing slash (ie: "../my-new-web-repo"): '
read PATH

# Make paths we need
/bin/mkdir $PATH/logs

# Copying paths
/bin/cp -Rv app $PATH/.
/bin/cp -Rv config $PATH/.
/bin/cp -Rv lib $PATH/.
/bin/cp -Rv template $PATH/.
/bin/cp -Rv test $PATH/.

# Copying files
/bin/cp -v .coveralls-dist.yml $PATH/.
/bin/cp -v .gitignore $PATH/.
/bin/cp -v .jscsrc $PATH/.
/bin/cp -v .jshintrc $PATH/.
/bin/cp -v .travis.yml $PATH/.
/bin/cp -v Gruntfile.js $PATH/.
/bin/cp -v LICENSE $PATH/.
/bin/cp -v README.md $PATH/.
/bin/cp -v changelog.sh $PATH/.
/bin/cp -v install.sh $PATH/.
/bin/cp -v package.json $PATH/.
/bin/cp -v report-code-coverage.sh $PATH/.
/bin/cp -v run-server.sh $PATH/.
/bin/cp -v run-tests.sh $PATH/.
/bin/cp -v run-watch.sh $PATH/.

cd $PATH
/bin/cp -v ./.coveralls-dist.yml ./.coveralls.yml

echo ''
echo 'Todo:'
echo '1. Update coverlalls.yml with the correct token.'
echo '2. Run `npm install`'
echo '3. Run your server `./run-server.sh`.'
echo ''
echo 'All set :)'
echo ''