import base64ArrayBuffer from './bufferToBase64';
import { buildWavBytes } from './wavBuilder';

export const makeSound = (int16Array, sampleRate, numChannels) => {
  const wav = buildWavBytes(int16Array, sampleRate, numChannels);
  const base64 = 'data:audio/wav;base64,' + base64ArrayBuffer(wav);
  return new Audio(base64);
};
