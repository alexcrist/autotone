import * as tf from '@tensorflow/tfjs';
import { serializeModel } from '../../util/tensorFlowUtils';
import { concat, push } from '../../util/typedArrayUtils';

export class PitchNode extends AudioWorkletNode {

  audio;
  freqs;
  confidences;
  _isModelLoaded;
  
  constructor(context) {
    super(context, 'pitch-processor', { parameterData: { sampleRate: context.sampleRate }});
    this.port.onmessage = this.onMessage.bind(this);
    this.reset();
  }

  reset() {
    this.port.postMessage({ type: 'reset' });
    this.audio = new Float32Array();
    this.freqs = new Float32Array();
    this.confidences = new Float32Array();
  }

  async loadModel() {
    this._isModelLoaded = {};
    this._isModelLoaded.promise = new Promise((resolve) => this._isModelLoaded.resolve = resolve);
    const model = await tf.loadLayersModel('pitch_detection_model/model.json');
    const modelJSON = await serializeModel(model);
    this.port.postMessage({ type: 'load-model', payload: { modelJSON }});
    return this._isModelLoaded.promise;
  }

  onMessage(message) {
    const { type, payload } = message.data;
    if (type === 'model-loaded') {
      this.onModelLoaded(); 
    } else if (type === 'audio-data') {
      this.onAudioData(payload);
    }
  }

  onModelLoaded() {
    this._isModelLoaded.resolve();
  }

  onAudioData(payload) {
    const { audioData, freq, confidence } = payload;
    console.log('onAudioData', audioData);
    this.audio = concat(this.audio, audioData, Float32Array);
    this.freqs = push(this.freqs, freq, Float32Array);
    this.confidences = push(this.confidences, confidence, Float32Array);
  }
}
