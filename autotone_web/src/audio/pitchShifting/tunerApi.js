import createModule from './wasm/tunerWasm.js';
import { WasmModule } from '../../utils/wasmUtils.js';
import { MAX_INT_16, MIN_INT_16 } from './tunerConstants.js';

const wasm = new WasmModule();
const tunerGetNumWindows = wasm.cwrap('get_num_windows', 'number', ['number', 'number', 'number']);
const tunerResampleLinear = wasm.cwrap('resample_linear', null, ['number', 'number', 'number', 'number']);
const tunerPitchSnap = wasm.cwrap('pitch_snap', null, ['number', 'number', 'number', 'number', 'number']);
const tunerPitchShift = wasm.cwrap('pitch_shift', null, ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);

export const init = async () => {
  await wasm.init(createModule);
};

export const getNumWindows = (
  audioSize,
  windowSize,
  osamp,
) => {
  return tunerGetNumWindows(audioSize, windowSize, osamp);
};

export const resampleLinear = (
  array, // Float32Array
  newLength
) => {
  const arrayPointer = wasm.float32ArrayToPointer(array);
  const outputPointer = wasm.float32ArrayToPointer(new Float32Array(newLength));
  tunerResampleLinear(
    arrayPointer.address,
    array.length,
    outputPointer.address,
    newLength,
  );
  const output = wasm.pointerToFloat32Array(outputPointer.address, newLength);
  arrayPointer.free();
  outputPointer.free();
  return output;
}

export const pitchSnap = (
  freqs, // Float32Array 
  scale, // Float32Array
) => {
  const freqsPointer = wasm.float32ArrayToPointer(freqs);
  const scalePointer = wasm.float32ArrayToPointer(scale);
  const outputPointer = wasm.float32ArrayToPointer(new Float32Array(freqs.length));
  tunerPitchSnap(
    freqsPointer.address,
    freqs.length,
    scalePointer.address,
    scale.length,
    outputPointer.address,
  );  
  const output = wasm.pointerToFloat32Array(outputPointer.address, freqs.length);
  freqsPointer.free();
  scalePointer.free();
  outputPointer.free();
  return output;
};

export const pitchShift = (
  audio,         // Float32Array,
  sampleRate,
  windowSize,
  osamp,
  originalFreqs, // Float32Array
  targetFreqs,   // Float32Array
  targetFreqsOffset=0,
) => {

  const int16Audio = new Int16Array(audio.length);
  for (let i = 0; i < audio.length; i++) {
    const sample = Math.max(-1, Math.min(1, audio[i]));
    int16Audio[i] = sample < 0 ? sample * -MIN_INT_16 : sample * MAX_INT_16;
  }

  const audioPointer = wasm.int16ArrayToPointer(int16Audio);
  const originalFreqsPointer = wasm.float32ArrayToPointer(originalFreqs);
  const targetFreqsPointer = wasm.float32ArrayToPointer(targetFreqs);
  const outputPointer = wasm.int16ArrayToPointer(new Int16Array(audio.length));
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
  const output = wasm.pointerToInt16Array(outputPointer.address, audio.length);
  audioPointer.free();
  originalFreqsPointer.free();
  targetFreqsPointer.free();
  outputPointer.free();

  const float32Output = new Float32Array(audio.length);
  for (let i = 0; i < audio.length; i++) {
    const sample = output[i];
    float32Output[i] = sample < 0 ? sample / -MIN_INT_16 : sample / MAX_INT_16;
  }

  return float32Output;
};
