const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


const config = {
  entry: {
    index: './src/index.js',
    crepeWorker: './src/audio/pitchDetection/crepeWorker.js',
    tunerWorker: './src/audio/pitchShifting/tunerWorker.js',
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
          from: 'index.html',
          to: '.'
        },
        { 
          from: 'src/audio/pitchDetection/model', 
          to: 'crepeModel' 
        },
        {
          from: 'src/audio/pitchShifting/wasm/tunerWasm.wasm',
          to: '.'
        }
      ],
    }),
  ],
  devtool: 'cheap-source-map',
};

module.exports = config;