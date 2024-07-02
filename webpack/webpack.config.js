/* eslint @typescript-eslint/no-var-requires: "off" */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { EnvironmentPlugin, ProvidePlugin } = require('webpack');

const webpackData = require('../src/assets/weback.json');

require('dotenv').config();
const projPath = path.resolve(__dirname, '../dist');

module.exports = {
  entry: {
    main: './src/index.tsx',
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'node_vendors', // part of the bundle name and
          // can be used in chunks array of HtmlWebpackPlugin
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
        common: {
          test: /[\\/]src[\\/]components[\\/]/,
          chunks: 'all',
          minSize: 0,
        },
      },
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s?[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new EnvironmentPlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      meta: webpackData.meta,
      title: webpackData.title,
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  resolve: {
    alias: {
      '@client': path.resolve('src/'),
    },
    fallback: {
      crypto: false,
      stream: false,
      path: false,
      buffer: require.resolve('buffer'),
    },
    extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  output: {
    path: projPath,
    publicPath: '/',
    filename: '[name].[contenthash].js',
    clean: true,
  },
};
