import { getBufferSize as getCrepeBufferSize } from './crepe.js';

const crepeWorker = new Worker('dist/crepeWorker.bundle.js');

let resolveInit;
let resolveProcess;

export const getBufferSize = getCrepeBufferSize;

export const init = (sampleRate) => {
  return new Promise((resolve) => {
    crepeWorker.postMessage({ type: 'init', payload: sampleRate });
    resolveInit = resolve;
  });
};

export const process = (buffers) => {
  return new Promise((resolve) => {
    crepeWorker.postMessage({ 
      type: 'process',
      payload: buffers,
    });
    resolveProcess = resolve;
  });
};

crepeWorker.addEventListener('message', (message) => {
  const { type, payload } = message.data;
  if (type === 'init-done') {
    resolveInit();
  } else if (type === 'process-done') {
    resolveProcess(payload);
  }
});