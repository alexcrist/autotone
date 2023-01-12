import { BufferNode } from "./BufferNode";

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

export const initBufferProcessor = async (bufferSize) => {
  await audioContext.audioWorklet.addModule('dist/BufferProcessor.bundle.js');
  bufferNode = new BufferNode(audioContext, bufferSize);
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