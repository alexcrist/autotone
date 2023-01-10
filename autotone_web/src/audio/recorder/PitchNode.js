import { concat, push } from '../../util/typedArrayUtils';

export class PitchNode extends AudioWorkletNode {

  audio;
  freqs;
  confidences;
  
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

  onMessage(message) {
    const { audioData, freq, confidence } = message.data;
    this.audio = concat(this.audio, audioData, Float32Array);
    this.freqs = push(this.freqs, freq, Float32Array);
    this.confidences = push(this.confidences, confidence, Float32Array);
  }
}
