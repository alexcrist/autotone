const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    index: './src/index.js',
    pitchProcessor: './src/audio/recorder/PitchProcessor.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: 'cheap-source-map',
};

module.exports = config;