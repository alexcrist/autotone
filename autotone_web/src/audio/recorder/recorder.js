import { PitchNode } from './PitchNode.js';

let audioContext;
let pitchNode;

export const init = async () => {
  audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule('dist/pitchProcessor.bundle.js');
  pitchNode = new PitchNode(audioContext);
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mic = audioContext.createMediaStreamSource(stream);
  mic.connect(pitchNode);
  audioContext.suspend();
};

export const record = async () => {
  pitchNode.reset();
  audioContext.resume();
};

export const stop = () => {
  audioContext.suspend();
};

export const getData = () => {
  return {
    audio: pitchNode.audio,
    sampleRate: audioContext.sampleRate,
    freqs: pitchNode.freqs,
    confidences: pitchNode.confidences,
  };
};