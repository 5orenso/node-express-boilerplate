'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['app/**/*.js', 'lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            }
        },
        jscs: {
            main: ['app/**/*.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
                config: ".jscsrc"
            }
        },
        jsdoc: {
            dist: {
                src: ['lib/**/*.js', 'app/**/*.js'],
                options: {
                    tutorials: 'tutorials',
                    destination: 'doc',
                    template: 'node_modules/ink-docstrap/template',
                    configure: 'node_modules/ink-docstrap/template/jsdoc.conf.json'
                }
            }
        },
        watch: {
            all: {
                files: ['app/**/*.js', 'lib/**/*.js', 'test/**/*.js', 'config/*.js', 'template/**/*.html'],
                tasks: ['lint', 'buster:unit']
            }
        },

        buster: {
            unit: {
            }
        },
        nodemon: {
            dev: {
                options: {
                    file: 'app/server.js',
                    args: ['-c', '../config/config-dist.js']
                },
                tasks: ['jshint', 'buster:unit']
            }
        },
        shell: {
            getLatestTag: {
                command: 'git describe --abbrev=0 --tags',
                options: {
                    callback: function (err, stdout, stderr, cb) {
                        stdout = stdout.trim();
                        // If we have a leading 'v' in the version, remove it
                        if (stdout.substring(0, 1) === 'v') {
                            stdout = stdout.substring(1);
                        }
                        console.log('Latest tag: ' + stdout);
                        grunt.config.set('latestTag', stdout);
                        console.log('s3cmd put artifact/' + stdout + '.tar.gz s3://node-express-boilerplate-releases/');
                        console.log('');
                        console.log('PS! Remember to upload a corresponding config tar-ball to s3://node-express-boilerplate-<purpose>-configs');
                        cb();
                    }
                }
            },
            multiple: {
                command: [
                    'mkdir -p artifact',
                    'mv ./node_modules ./node_modules2',
                    'npm install --production',
                    'tar --exclude "./.git*" --exclude "./node_modules2" --exclude "./test*" --exclude "./coverage" --exclude "./artifact" --exclude "./app/config/config*" --exclude "./.idea" --exclude "./dev" -zcf artifact/<%= latestTag %>.tar.gz .',
                    'rm -rf node_modules',
                    'mv ./node_modules2 ./node_modules',
                    'bash changelog.sh'
                ].join('&&')
            }
        },
        coveralls: {
            real_coverage: {
                src: 'coverage/lcov.info'
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks('grunt-coveralls');

    // Default task.
    grunt.registerTask( "lint", [ "jshint", "jscs" ] );
    grunt.registerTask('default', ['lint', 'buster:unit', 'jsdoc']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('test', 'buster:unit');
    grunt.registerTask('check', ['watch']);
    grunt.registerTask('run', ['buster:unit', 'nodemon:dev']);
    grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('artifact', ['shell', 'coveralls:real_coverage', 'jsdoc']);

};
