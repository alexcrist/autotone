import { createWebWorkerReceiver } from '../../utils/webWorkerUtils.js';
import * as crepe from './crepeApi.js';
import * as constants from './crepeConstants.js';

/* eslint-disable no-restricted-globals */
self.onmessage = createWebWorkerReceiver(self.postMessage, [
  {
    key: constants.CREPE_GET_BUFFER_SIZE,
    fn: crepe.getBufferSize,
  },
  {
    key: constants.CREPE_INIT,
    fn: crepe.init,
  },
  {
    key: constants.CREPE_DETECT_PITCHES,
    fn: crepe.detectPitches,
  }
]);
/* eslint-enable no-restricted-globals */
