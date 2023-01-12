import * as recorder from './audio/recorder/recorder.js';
import * as player from './audio/player/player.js';

const init = async () => {
  await recorder.init();
  await player.init();  
  console.log('Init done.');
};

init();

const recordBtn = document.querySelector('#record');
const stopBtn = document.querySelector('#stop');
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

playOriginalBtn.addEventListener('click', () => {
  console.log('Play original');
  const { audio, sampleRate } = recorder.getData();
  console.log('audio', audio);
  player.play(audio, sampleRate);
});

playAutotonedBtn.addEventListener('click', () => {
  console.log('Play autotoned');
});
