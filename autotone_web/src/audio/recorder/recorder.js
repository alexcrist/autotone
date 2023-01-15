import { BufferNode } from './BufferNode.js';

let audioContext;
let microphone;
let bufferNode;

export const init = async () => {
  audioContext = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  microphone = audioContext.createMediaStreamSource(stream);
  audioContext.suspend();
  return {
    sampleRate: audioContext.sampleRate,
  };
};

export const initBufferProcessor = async (bufferSize, osamp) => {
  await audioContext.audioWorklet.addModule('BufferProcessor.bundle.js');
  bufferNode = new BufferNode(audioContext, bufferSize, osamp);
  microphone.connect(bufferNode);
};

export const record = async () => {
  bufferNode.reset();
  audioContext.resume();
};

export const stop = () => {
  audioContext.suspend();
};

export const getData = () => {
  return {
    sampleRate: audioContext.sampleRate,
    ...bufferNode.getAudioData(),
  };
};