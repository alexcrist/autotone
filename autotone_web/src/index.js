import * as crepe from './audio/pitchDetection/crepeWorkerApi.js';
import * as player from './audio/player/player.js';
import * as recorder from './audio/recorder/recorder.js';

const init = async () => {
  const options = await recorder.init();
  const bufferSize = crepe.getBufferSize(options.sampleRate);
  await recorder.initBufferProcessor(bufferSize);
  await player.init();
  await crepe.init(options.sampleRate);
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
  console.log('Autotone');
  const { buffers } = recorder.getData();
  const { freqs, confidences } = await crepe.process(buffers);
  console.log('freqs', freqs);
  console.log('confidences', confidences);
});

playOriginalBtn.addEventListener('click', () => {
  console.log('Play original');
  const { audio, sampleRate } = recorder.getData();
  console.log('audio', audio);
  player.play(audio, sampleRate);
});

playAutotonedBtn.addEventListener('click', () => {
  console.log('Play autotoned');
});
