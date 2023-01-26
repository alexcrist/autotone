# Autotone

> A vocal pitch correction web application (like Autotune): https://alexcrist.github.io/autotone/

This project works using CREPE's pitch detection model and Stephan Bernsee's approach to Fourier-transform based pitch shifting:
* [CREPE: A Convolutional REpresentation for Pitch Estimation -- pre-trained model (ICASSP 2018)](https://github.com/marl/crepe)
* [Pitch Shifting Using The Fourier Transform by Stephan Bernsee](http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/)

## 🤖 How it works

To perform vocal pitch correction, the input audio goes through two stages: pitch detection and pitch shifting.

To detect pitches, one of CREPE's pre-trained models is run using TensorFlowJS. To pitch shift, WebAssembly is used to run a C library that performs Fourier-based pitch shifting according to Stephan Bernsee's blog post above. Additionally, the audio processing algorithms are run in the background on web workers to prevent the browser from becoming unresponsive.

## 💻 Development

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

## 📚 Technologies used

* TensorFlow.js
* WebAssembly (Emscripten)
* Web audio API
* Web workers
* React
* Webpack

## 🔭 Future work

* Allow user to set pitch detection over-sampling factor
  * This will involve moving audio window/buffer building 
    logic out of BufferNode/Processor and into Autotoner
* Allow user to upload audio (instead of just microphone)
  * Implement high quality audio resampler
* Allow stereo (currently just mono)
* Add more types of scales
* Allow user to pitch correct according to a separate target audio or MIDI input
