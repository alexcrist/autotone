import * as crepe from './crepe.js';

/* eslint-disable no-restricted-globals */
self.onmessage = (message) => onMessage(message);
const sendMessage = (type, payload) => self.postMessage({ type, payload });
/* eslint-enable no-restricted-globals */

const onMessage = (message) => {
  const { type, payload } = message.data;
  if (type === 'init') {
    init(payload);
  } else if (type === 'process') {
    processBuffers(payload);
  }
};

const init = async (sampleRate) => {
  await crepe.init(sampleRate);
  sendMessage('init-done');
};

const processBuffers = (buffers) => {
  const freqs = [];
  const confidences = [];
  for (let i = 0; i < buffers.length; i++) {
    const { freq, confidence } = crepe.detectPitch(buffers[i]);
    freqs.push(freq);
    confidences.push(confidence);
  }
  sendMessage('process-done', { freqs, confidences});
};