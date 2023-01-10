import * as recorder from './audio/recorder/recorder.js';
import * as player from './audio/player/player.js';

recorder.init();
player.init();

let nClicks = false;

document.addEventListener('click', () => {
  nClicks++;
  if (nClicks === 1) {
    console.log('record');
    recorder.record();
  } else if (nClicks === 2) {
    console.log('stop');
    recorder.stop();
  } else if (nClicks === 3) {
    console.log('play');
    const { audio, sampleRate } = recorder.getData();
    console.log(audio);
    player.play(audio, sampleRate);
  }
});