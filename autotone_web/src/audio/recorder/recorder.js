import { PitchNode } from './PitchNode.js';

let audioContext;
let microphone;
let pitchNode;

export const init = async () => {
  audioContext = new AudioContext();
  audioContext.suspend();

  await audioContext.audioWorklet.addModule('dist/pitchProcessor.bundle.js');
  pitchNode = new PitchNode(audioContext);
  await pitchNode.loadModel();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(pitchNode);
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