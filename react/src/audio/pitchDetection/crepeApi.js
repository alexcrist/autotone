// Pitch detection model is from the CREPE project
//   CREPE: A Convolutional Representation for Pitch Estimation
//   By Jong Wook Kim, Justin Salamon, Peter Li, Juan Pablo Bello
//   https://github.com/marl/crepe

import * as tf from '@tensorflow/tfjs';
import * as constants from './crepeConstants.js';

let _model;
let _sampleRate;

export const getBufferSize = (sampleRate) => {
  const minBufferSize = sampleRate / constants.CREPE_SAMPLE_RATE * constants.CREPE_MIN_WINDOW_SIZE;
  return 2 ** Math.ceil(Math.log2(minBufferSize));
};

export const init = async (sampleRate) => {
  _model = await tf.loadLayersModel('crepeModel/model.json');
  _sampleRate = sampleRate;
};

export const detectPitches = (buffers) => {
  const results = [];
  for (let i = 0; i < buffers.length; i++) {
    results.push(detectPitch(buffers[i]));
  }
  return results;
};

const detectPitch = (buffer) => {
  let freq;
  let confidence;
  const resampled = resample(buffer);
  tf.tidy(() => {
    
    // run the prediction on the model
    const frame = tf.tensor(resampled.slice(0, 1024));
    const zeromean = tf.sub(frame, tf.mean(frame));
    const framestd = tf.tensor(tf.norm(zeromean).dataSync()/Math.sqrt(1024));
    const normalized = tf.div(zeromean, framestd);
    const input = normalized.reshape([1, 1024]);
    const activation = _model.predict([input]).reshape([360]);

    // the confidence of voicing activity and the argmax bin
    confidence = activation.max().dataSync()[0];
    const center = activation.argMax().dataSync()[0];

    // slice the local neighborhood around the argmax bin
    const start = Math.max(0, center - 4);
    const end = Math.min(360, center + 5);
    const weights = activation.slice([start], [end - start]);
    const cents = constants.CENT_MAPPING.slice([start], [end - start]);

    // take the local weighted average to get the predicted pitch
    const products = tf.mul(weights, cents);
    const productSum = products.dataSync().reduce((a, b) => a + b, 0);
    const weightSum = weights.dataSync().reduce((a, b) => a + b, 0);
    const predictedCent = productSum / weightSum;
    freq = 10 * Math.pow(2, predictedCent / 1200.0);
  });
  
  return { freq, confidence };
};

const resample = (buffer) => {
  const interpolate = _sampleRate % constants.CREPE_SAMPLE_RATE !== 0;
  const multiplier = _sampleRate / constants.CREPE_SAMPLE_RATE;
  const resampled = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) {
    if (!interpolate) {
      resampled[i] = buffer[i * multiplier];
    } else {
      const left = Math.floor(i * multiplier);
      const right = left + 1;
      const p = i * multiplier - left;
      resampled[i] = (1 - p) * buffer[left] + p * buffer[right];
    }
  }
  return resampled;
};