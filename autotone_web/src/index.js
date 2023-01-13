import * as crepe from './audio/pitchDetection/crepe.js';
import * as player from './audio/player/player.js';
import * as recorder from './audio/recorder/recorder.js';
import * as tuner from './audio/pitchShifting/tuner.js';
import { getScaleFreqs } from './audio/music/musicScales.js';

const WINDOW_SIZE = 1024;
const OSAMP = 32;

let newAudio;

const init = async () => {
  const options = await recorder.init();
  const bufferSize = await crepe.getBufferSize(options.sampleRate);
  await recorder.initBufferProcessor(bufferSize);
  await player.init();
  await crepe.init(options.sampleRate);
  await tuner.init();
  console.log('Init done.');
};

init();

const recordBtn = document.querySelector('#record');
const stopBtn = document.querySelector('#stop');
const autotoneBtn = document.querySelector('#autotone');
const playOriginalBtn = document.querySelector('#play-original');
const playAutotonedBtn = document.querySelector('#play-autotoned');

recordBtn.addEventListener('click', () => {
  console.log('Record');
  recorder.record();
});

stopBtn.addEventListener('click', () => {
  console.log('Stop');
  recorder.stop();
});

autotoneBtn.addEventListener('click', async () => {
  console.log('Autotoning...');
  const { audio, buffers, sampleRate } = recorder.getData();
  const freqData = await crepe.detectPitches(buffers);
  const freqs = new Float32Array(freqData.map((data) => data.freq));
  const numWindows = await tuner.getNumWindows(audio.length, WINDOW_SIZE, OSAMP);
  if (freqs.length > numWindows) {
    throw Error('freqs.length > numWindows');
  }
  const originalFreqs = await tuner.upsampleFreqs(freqs, numWindows);
  const scale = getScaleFreqs('C', 'Major');
  const targetFreqs = await tuner.pitchSnap(originalFreqs, scale);
  newAudio = await tuner.pitchShift(
    audio,
    sampleRate,
    WINDOW_SIZE,
    OSAMP,
    originalFreqs,
    targetFreqs,
  );
  console.log('Autotoned.');
});

playOriginalBtn.addEventListener('click', () => {
  console.log('Play original');
  const { audio, sampleRate } = recorder.getData();
  player.play(audio, sampleRate);
});

playAutotonedBtn.addEventListener('click', () => {
  console.log('Play autotoned');
  const { sampleRate } = recorder.getData();
  player.play(newAudio, sampleRate);
});
