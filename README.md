# Autotone

An automatic pitch correction web application. Like Autotune, but open source!

This project uses a pre-trained Tensorflow model provided by [CREPE](https://github.com/marl/crepe) for pitch detction and [Stephan M. Bernsee's Fourier-transform based method of pitch shifting](http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/). WebAssembly is used to run the C-based pitch shifting library while TensorflowJS runs the pitch detction model.

Additionally, web workers are used to run the audio processing algorithms in the background, preventing the browser from becoming unresponsive.

## Running the project locally

## Resources

* [CREPE: A Convolutional REpresentation for Pitch Estimation -- pre-trained model (ICASSP 2018)](https://github.com/marl/crepe)
* [Pitch Shifting Using The Fourier Transform by Stephan Bernsee](http://blogs.zynaptiq.com/bernsee/pitch-shifting-using-the-ft/)
