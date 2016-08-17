var webpackConfig = require('./webpack.common.js');
webpackConfig.entry = {};


//const webpack = require('webpack');
/* var cssnext = require('postcss-cssnext');
 * var postcssReporter = require('postcss-reporter');
 * var path = require('path');
 * */
//const SRC = path.resolve(__dirname, 'app');

module.exports = function(config) {
  config.set( {
    basePath: '',
    frameworks:[
      'jasmine'
    ],
    files: [
      'test/**/*.js'
    ],

    preprocessors: {
      // add webpack as preprocessor
      'app/**/*.js': ['webpack', 'sourcemap'],
      'test/**/*.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,
    /*
     *     webpack: { //kind of a copy of your webpack config
     *       devtool: 'inline-source-map', //just do inline source maps instead of the default
     *                module: {
     *                  loaders: [
     *                    {
     *                      test: /\.js$/,
     *                      loader: 'babel',
     *                      exclude: path.resolve(__dirname, 'node_modules'),
     *                      query: {
     *                        presets: ['airbnb']
     *                      }
     *                    },
     *                    {
     *                      test: /\.json$/,
     *                      loader: 'json',
     *                    },
     *                    {
     *                      test: /\.css$/,
     *                      loader: 'style!css?modules&localIdentName=[folder]__[local]--[hash:base64:5]&camelCase&importLoaders=1!postcss'
     *                    },
     *                    {
     *                      test: /\.(png|jpe?g|gif|svg)$/,
     *                      loader: 'url?name=public/images/[name].[ext]&limit=10000'
     *                    },
     *                    {
     *                      test: /\.(ttf|eot|woff2?|otf)$/,
     *                      loader: 'url?name=public/fonts/[name].[ext]&limit=10000'
     *                    },
     *                  ]
     *                },
     *                externals: {
     *                  'cheerio': 'window',
     *                  'react/addons': true, // important!!
     *                  'react/lib/ExecutionEnvironment': true,
     *                  'react/lib/ReactContext': true
     *                }
     *     },*/
    webpackServer: {
                 noInfo: true //please don't spam the console when running in karma!
               },
    babelPreprocessor: {
      options: {
        presets: ['airbnb']

      }
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
  } )
};
