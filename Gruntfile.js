/* eslint-disable */
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(grunt) {
    grunt.initConfig({
        eslint: {
            target: [
                'tasks/**/*.js',
                'src/**/*.js',
                'Gruntfile.js',
            ],
        },

        sasslint: {
            target: [
                'src/**/*.scss',
            ],
        },

        webpack: {
            options: {
                output: {
                    path: path.resolve(__dirname, 'dist'),
                    library: 'SiteWideBanners',
                    libraryTarget: 'umd'
                },
                module: {
                    rules: [
                        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
                    ]
                },
            },
            development: {
                entry: [
                    'whatwg-fetch',
                    './index.js'
                ],
                output: {
                    filename: 'sitewide-banners.js'
                }
            },
            production: {
                entry: [
                    'whatwg-fetch',
                    './index.js'
                ],
                output: {
                    filename: 'sitewide-banners.min.js'
                },
                plugins: [
                    new CleanWebpackPlugin(['dist']),
                    new UglifyJsPlugin()
                ]
            },
        }
    });

    // Load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-sass-lint');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.registerTask('default', ['eslint', 'sasslint']);
};
