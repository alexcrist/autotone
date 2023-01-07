import createModule from './wasmBuild.js';
import { getScaleFreqs } from '../audio/musicalScales';

// WASM helpers ========================================================

let Module;

const cwrap = (...cwrapArgs) => (...fnCallArgs) => {
  return Module.ccall(...cwrapArgs, [...fnCallArgs]);
};

// Converting JS typed arrays into pointers for passing to C functions =

const int16ArrayToPointer = (array) => {
  return arrayToPointer(array, 2, 'i16');
};

const int32ArrayToPointer = (array) => {
  return arrayToPointer(array, 4, 'i32');
};

const float32ArrayToPointer = (array) => {
  return arrayToPointer(array, 4, 'float');
};

const float64ArrayToPointer = (array) => {
  return arrayToPointer(array, 8, 'double');
};

const arrayToPointer = (array, bytesPerElement, dataType) => {
  const numBytes = array.length * bytesPerElement;
  const pointer = Module._malloc(numBytes);
  for (let i = 0; i < array.length; i++) {
    const address = pointer + i * bytesPerElement;
    Module.setValue(address, array[i], dataType);
  }
  const free = () => Module._free(pointer);
  return { address: pointer, free };
};

// Converting pointers back to JS tyeped arrays ========================

const pointerToInt16Array = (pointer, numElements) => {
  return new Int16Array(Module.HEAP16.buffer, pointer, numElements);
};

const pointerToInt32Array = (pointer, numElements) => {
  return new Int32Array(Module.HEAP32.buffer, pointer, numElements);
};

const pointerToFloat32Array = (pointer, numElements) => {
  return new Float32Array(Module.HEAPF32.buffer, pointer, numElements);
};

const pointerToFloat64Array = (pointer, numElements) => {
  return new Float64Array(Module.HEAPF64.buffer, pointer, numElements);
};

// Wrapping C functions ================================================

const tunerPitchDetect = cwrap('pitch_detect', null, ['number', 'number', 'number', 'number', 'number', 'boolean', 'boolean', 'number']);
const tunerGetNumPitches = cwrap('get_num_pitches', 'number', ['number', 'number', 'number']);
const tunerPitchSnap = cwrap('pitch_snap', null, ['number', 'number', 'number', 'number', 'number']);
const tunerPitchShift = cwrap('pitch_shift', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);

const pitchDetect = (
  audio, // Int16Array
  sampleRate,
  windowSize,
  osamp,
  doHighpass,
  doHilbertTransform,
) => {
  const outputSize = tunerGetNumPitches(audio.length, windowSize, osamp);
  const outputPointer = float32ArrayToPointer(new Float32Array(outputSize));
  const audioPointer = int16ArrayToPointer(audio);
  tunerPitchDetect(
    audioPointer.address,
    audio.length,
    sampleRate,
    windowSize,
    osamp,
    doHighpass,
    doHilbertTransform,
    outputPointer.address,
  );
  const output = pointerToFloat32Array(outputPointer.address, outputSize);
  audioPointer.free();
  outputPointer.free();
  return output;
};

const pitchSnap = (
  freqs, // Float32Array 
  scale, // Float32Array
) => {
  const freqsPointer = float32ArrayToPointer(freqs);
  const scalePointer = float32ArrayToPointer(scale);
  const outputPointer = float32ArrayToPointer(new Float32Array(freqs.length));
  tunerPitchSnap(
    freqsPointer.address,
    freqs.length,
    scalePointer.address,
    scale.length,
    outputPointer.address,
  );  
  const output = pointerToFloat32Array(outputPointer.address, freqs.length);
  freqsPointer.free();
  scalePointer.free();
  outputPointer.free();
  return output;
};

const pitchShift = (
  audio,         // Int16Array,
  sampleRate,
  windowSize,
  osamp,
  originalFreqs, // Float32Array
  targetFreqs,   // Float32Array
  targetFreqsOffset=0,
) => {
  const audioPointer = int16ArrayToPointer(audio);
  const originalFreqsPointer = float32ArrayToPointer(originalFreqs);
  const targetFreqsPointer = float32ArrayToPointer(targetFreqs);
  const outputPointer = int16ArrayToPointer(new Int16Array(audio.length));
  tunerPitchShift(
    audioPointer.address,
    audio.length,
    windowSize,
    sampleRate,
    osamp,
    originalFreqsPointer.address,
    originalFreqs.length,
    targetFreqsPointer.address,
    targetFreqs.length,
    targetFreqsOffset,
    outputPointer.address
  );
  const output = pointerToInt16Array(outputPointer.address, audio.length);
  audioPointer.free();
  originalFreqsPointer.free();
  targetFreqsPointer.free();
  outputPointer.free();
  return output;
};

// Tuner class =========================================================

class Tuner {

  constructor(
    audio,
    sampleRate,
    numChannels,
    windowSize,
    osamp,
    scaleBaseNote,
    scaleName,
  ) {
    if (numChannels !== 1) {
      alert('Error! Recorder is not mono! Stereo audio not yet supported.');
    }
    this.audio = audio;
    this.sampleRate = sampleRate;
    this.numChannels = numChannels;
    this.tune(
      windowSize,
      osamp,
      scaleBaseNote,
      scaleName,
    );
  }

  tune(
    windowSize,
    osamp,
    scaleBaseNote,
    scaleName,
  ) {
    if (
      this.windowSize !== windowSize ||
      this.osamp !== osamp
    ) {
      this.originalFreqs = pitchDetect(
        this.audio, 
        this.sampleRate, 
        windowSize, 
        osamp, 
        true, 
        true,
      );
      this.windowSize = windowSize;
      this.osamp = osamp;
    }

    if (
      this.scaleBaseNote !== scaleBaseNote ||
      this.scaleName !== scaleName
    ) {
      this.scale = getScaleFreqs(scaleBaseNote, scaleName);
      this.scaleBaseNote = scaleBaseNote;
      this.scaleName = scaleName;
    }

    this.correctedFreqs = pitchSnap(this.originalFreqs, this.scale);
    this.correctedAudio = pitchShift(
      this.audio,
      this.sampleRate,
      windowSize,
      osamp,
      this.originalFreqs,
      this.correctedFreqs,
    );
  }
}

// Web worker interface ================================================

/* eslint-disable no-restricted-globals */

self.onmessage = async (message) => {
  const { action, args } = message.data;
  if (action === 'loadWasm') {
    loadWasm();
  } else if (action === 'tunerInit') {
    tunerInit(args);
  } else if (action === 'tunerRetone') {
    tunerRetone(args);
  }
};

const loadWasm = async () => {
  Module = await createModule();
  self.postMessage({ type: 'wasmLoaded' });
};

let tuner;

const tunerInit = (args) => {
  tuner = new Tuner(...args);
  sendSounds();
};

const tunerRetone = (args) => {
  tuner.tune(...args);
  sendSounds();
};

const sendSounds = () => {
  self.postMessage({
    type: 'processingDone',
    payload: {
      audio: tuner.audio,
      correctedAudio: tuner.correctedAudio,
      sampleRate: tuner.sampleRate,
      numChannels: tuner.numChannels,
    },
  });
}

/* eslint-enable no-restricted-globals */