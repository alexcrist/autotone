export class BufferNode extends AudioWorkletNode {

  _buffers;
  _bufferSize;

  constructor(context, bufferSize) {
    super(context, 'buffer-processor', { parameterData: { bufferSize }});
    this._bufferSize = bufferSize;
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
    const audioSize = this._buffers.length * this._bufferSize;
    const audio = new Float32Array(audioSize);
    for (let i = 0; i < this._buffers.length; i++) {
      const buffer = this._buffers[i];
      const offset = i * this._bufferSize;
      audio.set(buffer, offset);
    }
    return {
      audio,
      buffers: this._buffers,
      bufferSize: this._bufferSize,
    };
  }
}
