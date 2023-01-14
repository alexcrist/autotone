import { getScaleFreqs } from "../music/musicScales";
import * as crepe from '../pitchDetection/crepe.js';
import * as tuner from '../pitchShifting/tuner.js';
import { PITCH_SHIFTING_OSAMP, PITCH_SHIFTING_WINDOW_SIZE } from "../pitchShifting/tunerConstants";
import * as player from '../player/player.js';
import * as recorder from '../recorder/recorder.js';
import { DEFAULT_BASE_NOTE, DEFAULT_SCALE_NAME } from "./autotoneConstants";

export class Autotoner {

  _scaleFreqs;
  _recordingData;
  _autotonedAudio;
  _originalFreqs;
  _autotonedFreqs;

  constructor() {
    this._scaleFreqs = getScaleFreqs(DEFAULT_BASE_NOTE, DEFAULT_SCALE_NAME);
  }

  async init() {
    const { sampleRate } = await recorder.init();
    const crepeBufferSize = await crepe.getBufferSize(sampleRate);
    await recorder.initBufferProcessor(crepeBufferSize);
    await player.init();
    await crepe.init(sampleRate);
    await tuner.init();
  }

  record() {
    recorder.record();
  }

  async stopRecording() {
    recorder.stop();
    this._recordingData = recorder.getData();
    await this.autotone();
  }

  setScale(baseNote, scaleName) {
    this._scaleFreqs = getScaleFreqs(baseNote, scaleName);
  }

  async autotone() {
    if (!this._recordingData) {
      return null;
    }
    const { audio, buffers, sampleRate } = recorder.getData();
    const freqData = await crepe.detectPitches(buffers);
    const freqs = new Float32Array(freqData.map((data) => data.freq));
    const numWindows = await tuner.getNumWindows(
      audio.length, 
      PITCH_SHIFTING_WINDOW_SIZE, 
      PITCH_SHIFTING_OSAMP,
    );
    if (freqs.length > numWindows) {
      throw Error('freqs.length > numWindows');
    }
    this._originalFreqs = await tuner.upsampleFreqs(freqs, numWindows);
    this._autotonedFreqs = await tuner.pitchSnap(this._originalFreqs, this._scaleFreqs);
    this._autotonedAudio = await tuner.pitchShift(
      audio,
      sampleRate,
      PITCH_SHIFTING_WINDOW_SIZE,
      PITCH_SHIFTING_OSAMP,
      this._originalFreqs,
      this._autotonedFreqs,
    );
  }

  getSampleRate() {
    return this._recordingData?.sampleRate || null;
  }

  getOriginalAudio() {
    return this._recordingData?.audio || null;
  }

  getAutotonedAudio() {
    return this._autotonedAudio || null;
  }

  getOriginalFreqs() {
    return this._originalFreqs || null;
  }

  getAutotonedFreqs() {
    return this._autotonedFreqs || null;
  }
}