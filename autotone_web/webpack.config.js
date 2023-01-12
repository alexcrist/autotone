const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


const config = {
  entry: {
    index: './src/index.js',
    crepeWorker: './src/audio/pitchDetection/crepeWorker.js',
    BufferProcessor: './src/audio/recorder/BufferProcessor.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'src/audio/pitchDetection/model', 
          to: 'crepeModel' 
        },
      ],
    }),
  ],
  devtool: 'cheap-source-map',
};

module.exports = config;