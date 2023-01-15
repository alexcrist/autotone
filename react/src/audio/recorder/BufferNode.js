export class BufferNode extends AudioWorkletNode {

  _buffers;
  _bufferSize;
  _osamp;

  constructor(context, bufferSize, osamp) {
    super(context, 'buffer-processor', { parameterData: { bufferSize, osamp }});
    this._bufferSize = bufferSize;
    this._osamp = osamp;
    this.port.onmessage = this.onMessage.bind(this);
    this.reset();
  }

  reset() {
    this._buffers = [];
    this.port.postMessage({ type: 'reset' });
  }

  onMessage(message) {
    this._buffers.push(message.data);
  }

  getAudioData() {
    const hopSize = this._bufferSize / this._osamp;
    const audioSize = this._bufferSize + ((this._buffers.length - 1) * hopSize);
    const audio = new Float32Array(audioSize);
    if (audioSize === 0) {
      return;
    }
    audio.set(this._buffers[0]);
    for (let i = 1; i < this._buffers.length; i++) {
      const offset = this._bufferSize + (i - 1) * hopSize;
      for (let j = 0; j < hopSize; j++) {
        audio[offset + j] = this._buffers[i][this._bufferSize - hopSize + j];
      }
    }
    return {
      audio,
      buffers: this._buffers,
      bufferSize: this._bufferSize,
      osamp: this._osamp,
    };
  }
}
