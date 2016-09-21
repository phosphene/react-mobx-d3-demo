import path from 'path';
import webpack from 'webpack';
import cssnext from 'postcss-cssnext';
import postcssReporter from 'postcss-reporter';
import { config, babelConfig } from './package.json';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const SRC = path.resolve(__dirname, 'app');
const BUILD = path.resolve(__dirname, 'server/public');

module.exports = {
  context: SRC,
  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/dev-server',
      './client'
    ],
    vendor: ['react', 'react-dom', 'react-router', 'mobx', 'mobx-react', 'mobx-react-devtools']
  },
  output: {
    path: BUILD,
    publicPath: config.assetsPublicPath,
    filename: '[name].bundle.js',
    library: 'store'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: babelConfig.client
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url?name=public/images/[name].[ext]&limit=10000'
    }, {
      test: /\.(ttf|eot|woff2?|otf)$/,
      loader: 'url?name=public/fonts/[name].[ext]&limit=10000'
    }, {
      // make all files ending in .json use the `json-loader`
      test: /\.json$/,
      loader: 'json-loader'
    }]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name].bundle.js',
    }),
    new CopyWebpackPlugin([
      {context: 'node_modules/react-bootstrap-theme-switcher/themes/', from: '**/*', to: 'themes/'}
    ],
                          {copyUnmodified: true}
    )
  ],
  postcss: () => [
    cssnext({
      browsers: ['last 2 versions', 'IE > 10'],
    }),
    postcssReporter({
      clearMessages: true,
    })
  ],
  devtool: 'inline-source-map',
  watch: true,
  resolve: {
    root: [
      path.resolve(process.cwd(), 'app/shared')
    ],
    extensions: ['', '.js', '.jsx']
  }
}
