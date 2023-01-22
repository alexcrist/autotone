import { WaveFileCreator } from 'wavefile-creator';

export const downloadWavFile = (
  audio, // Float32Array
  sampleRate,
  numChannels,
  fileName,
) => {
  const wavCreator = new WaveFileCreator();
  wavCreator.fromScratch(numChannels, sampleRate, '32f', audio);
  const buffer = wavCreator.toBuffer();
  downloadFile(buffer, fileName);
};

const downloadFile = (buffer, fileName) => {
  const blob = new Blob([buffer], { type: 'octet/stream' });
  const url = window.URL.createObjectURL(blob);
  const element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('download', fileName);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  window.URL.revokeObjectURL(url);
};