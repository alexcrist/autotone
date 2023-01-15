# Autotone

An automatic pitch correction web application. Like Autotune, but open source!

This project uses a pre-trained Tensorflow model provided by [CREPE](https://github.com/marl/crepe) for pitch detction and [Stephan M. Bernsee's Fourier-transform based method of pitch shifting](http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/). WebAssembly is used to run the C-based pitch shifting library while TensorflowJS runs the pitch detction model.

Additionally, web workers are used to run the audio processing algorithms in the background, preventing the browser from becoming unresponsive.

## Try it out

https://alexcrist.github.io/autotone/

## Technologies used

* TensorFlow.js
* WebAssembly (Emscripten)
* Web workers
* Web audio API
* React

## Development instructions

#### Dependencies
* Node v14.18.2

1. Clone this repo
2. Run the bootstrap script `scripts/bootstrap.sh`

## Resources

* [CREPE: A Convolutional REpresentation for Pitch Estimation -- pre-trained model (ICASSP 2018)](https://github.com/marl/crepe)
* [Pitch Shifting Using The Fourier Transform by Stephan Bernsee](http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/)
