const path = require('path');

const config = {
  entry: {
    crepeWorker: './src/audio/pitchDetection/crepe.worker.js',
    tunerWorker: './src/audio/pitchShifting/tuner.worker.js',
    BufferProcessor: './src/audio/recorder/BufferProcessor.js',
  },
  target: 'webworker',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: 'cheap-source-map',
};

module.exports = config;
