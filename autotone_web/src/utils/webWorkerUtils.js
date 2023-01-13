// These helpers abstract away the messaging interface of a web worker
// to instead expose a promisified API

// Should be called outside the wb worker
export const createWebWorkerSender = (worker, key) => {
  
  let resolveFn;

  worker.addEventListener('message', (message) => {
    const { type, payload } = message.data;
    if (type === key) {
      resolveFn(payload);
    }
  });
  
  return (...args) => {
    return new Promise((resolve) => {
      worker.postMessage({ type: key, payload: args });
      resolveFn = resolve;
    });
  };
};

// Should be called in the web worker
export const createWebWorkerReceiver = (sendMessage, fns) => {
  return async (message) => {
    const { type, payload } = message.data;
    for (const { key, fn } of fns) {
      if (key === type) {
        const result = await fn(...payload);
        sendMessage({ type: key, payload: result });
      }
    }
  };
};

