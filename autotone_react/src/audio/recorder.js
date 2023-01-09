import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

const RECORDER_TIME_SLICE_MS = 100; 

let mediaRecorder;
let recordingSettings;
let recordingPromise;
let recordedAudio;
let isInitialized = false;
let isWavRegistered = false;

const callbacks = {};

export const hasPermissions = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (e) {
    isInitialized = false;
    return false;
  }
};

export const getIsInitialized = () => isInitialized;

export const init = async () => {
  if (!isWavRegistered) {
    await register(await connect());
    isWavRegistered = true;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordingSettings = stream.getAudioTracks()[0].getSettings();
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });
    mediaRecorder.ondataavailable = onMediaRecorderDataAvailable;
    mediaRecorder.onstop = onMediaRecorderStop;
    isInitialized = true;
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};


export const setOnStop = (onStop) => callbacks.onStop = onStop;

export const record = () => {
  recordedAudio = new Uint8Array();
  recordingPromise = null;
  mediaRecorder.start(RECORDER_TIME_SLICE_MS);
};

export const stop = () => {
  mediaRecorder.stop();
};

export const getRecordedAudio = () => {
  return new Int16Array(recordedAudio.buffer);
};

export const getSampleRate = () => {
  if (recordingSettings) {
    return recordingSettings.sampleRate || 44100;
  }
  return null;
};

export const getNumChannels = () => {
  if (recordingSettings) {
    return recordingSettings.channelCount || 1;
  }
  return null;
};

export const getDuration = () => {
  return getRecordedAudio().length / getSampleRate();
};

const onMediaRecorderDataAvailable = (event) => {
  const promise = onDataAvailablePromise(event);
  if (recordingPromise) {
    recordingPromise = Promise.all([recordingPromise, promise]);
  } else {
    recordingPromise = promise;
  }
};

const onDataAvailablePromise = async (event) => {
  const buffer = await event.data.arrayBuffer();
  saveRecordedAudio(buffer);
};

const saveRecordedAudio = (arrayBuffer) => {
  const incomingAudio = new Uint8Array(arrayBuffer);
  const combinedAudio = new Uint8Array(recordedAudio.length + incomingAudio.length);
  combinedAudio.set(recordedAudio);
  combinedAudio.set(incomingAudio, recordedAudio.length);
  recordedAudio = combinedAudio;
};

const onMediaRecorderStop = async () => {
  await recordingPromise;
  callbacks.onStop();
};
