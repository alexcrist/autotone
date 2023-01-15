const httpServer = require('http-server');
const webpack = require('webpack');
const config = require('./webpack.config.js');

const env = process.argv[2];

const printStats = (err, stats) => {
  console.log(stats.toString({ colors: true }));
  if (err) {
    console.log('ERROR');
  }
};

if (env === 'production') {
  console.log('Creating production build...');
  const compiler = webpack({
    ...config,
    mode: 'production'
  });
  compiler.run(printStats);
}

else if (env === 'development') {
  console.log('Starting development server...');
  server = httpServer.createServer({
    root: 'dist',
    cache: -1,
  });
  server.listen(8080);
  const compiler = webpack({
    ...config,
    mode: 'development'
  });
  compiler.watch({}, printStats);
  console.log('Live at http://localhost:8080');
}

else {
  throw Error('Please provide a valid env arg, i.e.: "node webpack.js production"');
}