import { getScaleFreqs } from "../music/musicScales";
import * as crepe from '../pitchDetection/crepe.js';
import { DEFAULT_CREPE_OSAMP } from "../pitchDetection/crepeConstants";
import * as tuner from '../pitchShifting/tuner.js';
import { DEFAULT_TUNER_OSAMP, DEFAULT_TUNER_WINDOW_SIZE } from "../pitchShifting/tunerConstants";
import * as player from '../player/player.js';
import * as recorder from '../recorder/recorder.js';
import { DEFAULT_BASE_NOTE, DEFAULT_SCALE_NAME } from "./autotoneConstants";

export class Autotoner {

  _scaleFreqs;
  _tunerWindowSize;
  _tunerOsamp;
  _crepeOsamp;

  _recordingData;
  _autotonedAudio;
  _originalFreqs;
  _autotonedFreqs;

  constructor() {
    this._scaleFreqs = getScaleFreqs(DEFAULT_BASE_NOTE, DEFAULT_SCALE_NAME);
    this._tunerWindowSize = DEFAULT_TUNER_WINDOW_SIZE;
    this._tunerOsamp = DEFAULT_TUNER_OSAMP;
    this._crepeOsamp = DEFAULT_CREPE_OSAMP;
  }

  async init() {
    const { sampleRate } = await recorder.init();
    const crepeBufferSize = await crepe.getBufferSize(sampleRate);
    await recorder.initBufferProcessor(crepeBufferSize, this._crepeOsamp);
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

  setTunerWindowSize(windowSize) {
    this._tunerWindowSize = Number(windowSize);
  }

  setTunerOsamp(osamp) {
    this._tunerOsamp = Number(osamp);
  }

  async autotone() {
    if (!this._recordingData) {
      return null;
    }
    const { audio, buffers, sampleRate } = recorder.getData();
    const freqData = await crepe.detectPitches(buffers);
    const freqs = new Float32Array(freqData.map((data) => data.freq));
    const confidences = new Float32Array(freqData.map((data) => data.confidence));
    const numWindows = await tuner.getNumWindows(
      audio.length, 
      this._tunerWindowSize, 
      this._tunerOsamp,
    );
    if (confidences.length === numWindows) {
      console.log('No resampling');
    } else if (confidences.length < numWindows) {
      console.log('Upsampling');
    } else {
      console.log('Downsampling');
    }
    this._confidences = await tuner.resampleLinear(confidences, numWindows);
    this._originalFreqs = await tuner.resampleLinear(freqs, numWindows);
    this._autotonedFreqs = await tuner.pitchSnap(this._originalFreqs, this._scaleFreqs);
    this._autotonedAudio = await tuner.pitchShift(
      audio,
      sampleRate,
      this._tunerWindowSize,
      this._tunerOsamp,
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

  getConfidences() {
    return this._confidences || null;
  }
}