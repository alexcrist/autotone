const MODEL_SAMPLE_RATE = 16000;
const MODEL_MIN_WINDOW_SIZE = 1024;

class PitchProcessor extends AudioWorkletProcessor {

  _buffer;
  _bufferIndex;
  _bufferSize;
  _sampleRate;
  _centMapping;

  constructor(options) {
    super();
    this.port.onmessage = this.handleMessage.bind(this);
    this._sampleRate = options.parameterData.sampleRate;
    const minBufferSize = this._sampleRate / MODEL_SAMPLE_RATE * MODEL_MIN_WINDOW_SIZE;
    this._bufferSize = 2 ** Math.ceil(Math.log2(minBufferSize));
    this._buffer = new Float32Array(this._bufferSize);
    this.reset();
  }

  handleMessage(event) {
    const { type } = event.data;
    if (type === 'reset') {
      this.reset();
    }
  }

  reset() {
    this._bufferIndex = 0;
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
    const { freq, confidence } = this.detectFreq();
    this.port.postMessage({ audioData, freq, confidence });
  }

  detectFreq() {
    return { freq: 100, confidence: 0.1 };
  }
}

registerProcessor('pitch-processor', PitchProcessor);
