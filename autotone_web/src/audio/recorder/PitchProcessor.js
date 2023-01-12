import * as tf from '@tensorflow/tfjs';
import { deserializeModel } from '../../util/tensorFlowUtils';

const MODEL_SAMPLE_RATE = 16000;
const MODEL_MIN_WINDOW_SIZE = 1024;

class PitchProcessor extends AudioWorkletProcessor {

  _buffer;
  _bufferIndex;
  _bufferSize;
  _sampleRate;
  _centMapping;
  _model;

  constructor(options) {
    super();
    this.port.onmessage = this.handleMessage.bind(this);
    this._sampleRate = options.parameterData.sampleRate;
    const minBufferSize = this._sampleRate / MODEL_SAMPLE_RATE * MODEL_MIN_WINDOW_SIZE;
    this._bufferSize = 2 ** Math.ceil(Math.log2(minBufferSize));
    this._buffer = new Float32Array(this._bufferSize);
    this._centMapping = tf.add(tf.linspace(0, 7180, 360), tf.tensor(1997.3794084376191));
    this.reset();
  }

  handleMessage(event) {
    const { type, payload } = event.data;
    if (type === 'reset') {
      this.reset();
    } else if (type === 'load-model') {
      this.loadModel(payload);
    }
  }

  reset() {
    this._bufferIndex = 0;
  }

  async loadModel(payload) {
    const { modelJSON } = payload;
    this._model = await deserializeModel(modelJSON);
    this.port.postMessage({ type: 'model-loaded' });
  }

  process(inputs) {
    const firstInput = inputs[0];
    const firstChannel = firstInput[0];
    if (firstChannel) {
      for (let i = 0; i < firstChannel.length; i++) {
        this._buffer[this._bufferIndex] = firstChannel[i];
        this._bufferIndex++;
        if (this._bufferIndex === this._bufferSize) {
          this.flushBuffer();
        }
      }
    }
    return true;
  }

  flushBuffer() {
    this._bufferIndex = 0;
    const audioData = new Float32Array(this._buffer);
    const { freq, confidence } = this.detectFreq(audioData);
    this.port.postMessage({ type: 'audio-data', payload: { audioData, freq, confidence }});
  }

  detectFreq() {
    let freq;
    let confidence;
    const resampled = this.resample();
    tf.tidy(() => {
      
      // run the prediction on the model
      const frame = tf.tensor(resampled.slice(0, 1024));
      const zeromean = tf.sub(frame, tf.mean(frame));
      const framestd = tf.tensor(tf.norm(zeromean).dataSync()/Math.sqrt(1024));
      const normalized = tf.div(zeromean, framestd);
      const input = normalized.reshape([1, 1024]);
      const activation = this._model.predict([input]).reshape([360]);
  
      // the confidence of voicing activity and the argmax bin
      confidence = activation.max().dataSync()[0];
      const center = activation.argMax().dataSync()[0];
  
      // slice the local neighborhood around the argmax bin
      const start = Math.max(0, center - 4);
      const end = Math.min(360, center + 5);
      const weights = activation.slice([start], [end - start]);
      const cents = this._centMapping.slice([start], [end - start]);
  
      // take the local weighted average to get the predicted pitch
      const products = tf.mul(weights, cents);
      const productSum = products.dataSync().reduce((a, b) => a + b, 0);
      const weightSum = weights.dataSync().reduce((a, b) => a + b, 0);
      const predictedCent = productSum / weightSum;
      freq = 10 * Math.pow(2, predictedCent / 1200.0);
    });
    
    return { freq, confidence };
  }

  resample() {
    const interpolate = this._sampleRate % MODEL_SAMPLE_RATE !== 0;
    const multiplier = this._sampleRate / MODEL_SAMPLE_RATE;
    const resampled = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      if (!interpolate) {
        resampled[i] = this._buffer[i * multiplier];
      } else {
        const left = Math.floor(i * multiplier);
        const right = left + 1;
        const p = i * multiplier - left;
        resampled[i] = (1 - p) * this._buffer[left] + p * this._buffer[right];
      }
    }
    return resampled;
  }
}

registerProcessor('pitch-processor', PitchProcessor);
