const { resolve } = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.base.config');


// Create multiple instances
const extractCSS = new ExtractTextPlugin({ filename: './assets/styles/style.[chunkhash].css', disable: false, allChunks: true });
const extractLESS = new ExtractTextPlugin({ filename: './assets/styles/style.[chunkhash].css', disable: false, allChunks: true });

const config = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: {
    'assets/scripts/polyfill': '@babel/polyfill',
    'assets/scripts/main': './index.js',
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: 'assets/scripts/[name].[chunkhash].js',
    path: resolve(__dirname, '../dist'),
    publicPath: '',
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractLESS.extract({
          use: [
            'css-loader',
            { loader: 'sass-loader', query: { sourceMap: false } },
          ],
          publicPath: '../',
        }),
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
          ],
          publicPath: '../',
        }),
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new HtmlWebpackPlugin({
      template: `${__dirname}/../src/index.html`,
      filename: 'index.html',
      inject: 'body',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new CopyWebpackPlugin([{ from: './vendors', to: 'assets/vendors' }, { from: './assets', to: 'assets' }]),
    extractCSS,
    extractLESS,
  ],
});

module.exports = config;
