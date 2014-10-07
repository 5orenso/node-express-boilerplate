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
        watch: {
            all: {
                files: ['app/**/*.js', 'lib/**/*.js', 'test/**/*.js', 'config/*.js', 'template/**/*.html'],
                tasks: ['jshint', 'buster:unit']
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
                    args: ['-c', 'config/config-dist.js']
                },
                tasks: ['jshint', 'buster:unit']
            }
        },
        shell: {
            multiple: {
                command: [
                    'rm -rf artifact',
                    'mkdir -p artifact',
                    'mv node_modules ../node_modules2',
                    'npm install --production',
                    'tar -zcf artifact/node-boilerplate.tar.gz .',
                    'rm -rf node_modules',
                    'mv ../node_modules2 node_modules'
                ].join('&&')
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

    // Default task.
    grunt.registerTask('default', ['jshint', 'buster:unit']);
    grunt.registerTask('test', 'buster:unit');
    grunt.registerTask('check', ['watch']);
    grunt.registerTask('run', ['buster:unit', 'nodemon:dev']);
    grunt.registerTask('artifact', ['shell']);

};
