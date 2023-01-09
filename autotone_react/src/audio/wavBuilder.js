import { WaveFileCreator } from 'wavefile-creator';

export const buildWavBytes = (int16Array, sampleRate, numChannels) => {
  const wavCreator = new WaveFileCreator();
  wavCreator.fromScratch(numChannels, sampleRate, '16', int16Array);
  return wavCreator.toBuffer();
};
