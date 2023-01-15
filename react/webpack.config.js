const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanPlugin, ProvidePlugin } = require('webpack');

const jsLoaders = [
  {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-react']
    },
  },
];

const cssLoaders = [
  { 
    loader: 'style-loader',
  },
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: true,
      url: false,
    },
  },
];

const copyPluginOptions = {
  patterns: [
    {
      from: 'static',
      to: '.',
    },
    { 
      from: '../crepe/model', 
      to: 'crepeModel',
    },
    {
      from: 'src/audio/pitchShifting/wasm/tunerWasm.wasm',
      to: '.',
    }
  ],
};

const providePluginOptions = {
  React: 'react',
};

const config = {
  entry: {
    index: './src/index.js',
    crepeWorker: './src/audio/pitchDetection/crepe.worker.js',
    tunerWorker: './src/audio/pitchShifting/tuner.worker.js',
    BufferProcessor: './src/audio/recorder/BufferProcessor.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules)/,
        use: jsLoaders,
      },
      {
        test: /.css$/,
        use: cssLoaders,
      }
    ],
  },
  plugins: [
    new CleanPlugin(),
    new CopyPlugin(copyPluginOptions),
    new ProvidePlugin(providePluginOptions),
  ],
  devtool: false,
};

module.exports = config;
