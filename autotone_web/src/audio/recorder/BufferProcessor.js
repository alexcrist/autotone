class BufferProcessor extends AudioWorkletProcessor {

  _buffer;
  _bufferIndex;
  _bufferSize;
  _osamp;

  constructor(options) {
    super();
    this.port.onmessage = this.handleMessage.bind(this);
    this._bufferSize = options.parameterData.bufferSize;
    this._osamp = options.parameterData.osamp;
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
    this.port.postMessage(new Float32Array(this._buffer));
    const hopSize = this._bufferSize / this._osamp;
    for (let i = 0; i < this._bufferSize - hopSize; i++) {
      this._buffer[i] = this._buffer[i + hopSize];
    }
    this._bufferIndex -= hopSize;
  }
}

registerProcessor('buffer-processor', BufferProcessor);
