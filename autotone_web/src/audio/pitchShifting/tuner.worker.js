import { createWebWorkerReceiver } from '../../utils/webWorkerUtils.js';
import * as tuner from './tunerApi.js';
import * as constants from './tunerConstants.js';

/* eslint-disable no-restricted-globals */
self.onmessage = createWebWorkerReceiver(self.postMessage, [
  {
    key: constants.TUNER_INIT,
    fn: tuner.init,
  },
  {
    key: constants.TUNER_GET_NUM_WINDOWS,
    fn: tuner.getNumWindows,
  },
  {
    key: constants.TUNER_RESAMPLE_LINEAR,
    fn: tuner.resampleLinear,
  },
  {
    key: constants.TUNER_PITCH_SNAP,
    fn: tuner.pitchSnap,
  },
  {
    key: constants.TUNER_PITCH_SHIFT,
    fn: tuner.pitchShift,
  },
]);
/* eslint-enable no-restricted-globals */
