class BufferProcessor extends AudioWorkletProcessor {

  _buffer;
  _bufferIndex;
  _bufferSize;

  constructor(options) {
    super();
    this.port.onmessage = this.handleMessage.bind(this);
    this._bufferSize = options.parameterData.bufferSize;
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
    this.port.postMessage(new Float32Array(this._buffer));
  }
}

registerProcessor('buffer-processor', BufferProcessor);
