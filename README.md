# Autotone

https://alexcrist.github.io/autotone/

An automatic pitch correction web application. Like Autotune, but open source!

This project uses a pre-trained Tensorflow model provided by [CREPE](https://github.com/marl/crepe) for pitch detction and [Stephan M. Bernsee's Fourier-transform based method of pitch shifting](http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/). WebAssembly is used to run the C-based pitch shifting library while TensorflowJS runs the pitch detction model.

Additionally, web workers are used to run the audio processing algorithms in the background, preventing the browser from becoming unresponsive.

## Technologies used

* TensorFlow.js
* WebAssembly (Emscripten)
* Web audio API
* Web workers
* React
* Webpack

## Development instructions

#### Dependencies

* Node v14.18.2
* NPM v6.14.15
* Emscripten v3.1.29

#### Developing

1. Clone this repo
2. Init the `crepe` submodule with `git submodule init`
3. Build the C pitch-shifting library to WebAssembly by entering the `tuner` directory and running `make`
4. Install the web dependencies by entering the `react` directory and running `npm install`
6. Start the development server by entering the `react` directory and running `npm start`
7. View the app at `http://localhost:8080`

#### Deploying

Deploy the app to GitHub Pages using `scripts/deploy.sh`

## Resources

* [CREPE: A Convolutional REpresentation for Pitch Estimation -- pre-trained model (ICASSP 2018)](https://github.com/marl/crepe)
* [Pitch Shifting Using The Fourier Transform by Stephan Bernsee](http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/)
* [Web Audio API docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
