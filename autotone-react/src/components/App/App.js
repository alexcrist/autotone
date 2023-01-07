import { useEffect, useState } from 'react';
import { NOTES, SCALE_TYPES } from '../../audio/musicalScales';
import { makeSound } from '../../audio/player';
import * as recorder from '../../audio/recorder.js';
import styles from './App.module.css';

const worker = new Worker(new URL('../../wasm/tunerApiWrapper.js', import.meta.url));

const App = () => {

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSound, setOriginalSound] = useState(null);
  const [correctedSound, setCorrectedSound] = useState(null);

  const [scaleBaseNote, setScaleBaseNote] = useState(NOTES[0]);
  const [scaleName, setScaleName] = useState(SCALE_TYPES[0].name);
  const [windowSize, setWindowSize] = useState(512);
  const [osamp, setOsamp] = useState(64);

  useEffect(() => {
    worker.addEventListener('message', (message) => {
      console.log(message);
      const { type, payload } = message.data;
      if (type === 'wasmLoaded') {
        console.log('WASM loaded.');
      }
      if (type === 'processingDone') {
        const { audio, correctedAudio, sampleRate, numChannels } = payload;
        const originalSound = makeSound(audio, sampleRate, numChannels);
        const correctedSound = makeSound(correctedAudio, sampleRate, numChannels);
        setOriginalSound(originalSound);
        setCorrectedSound(correctedSound);
        setIsProcessing(false);
      }
    });
    worker.postMessage({ action: 'loadWasm' });
  }, []);

  const onClickRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    const isRecorderInitialized = recorder.getIsInitialized();
    if (!isRecorderInitialized) {
      const initSuccess = await recorder.init();
      if (!initSuccess) {
        alert('Error initializing audio recorder.');
        return;
      }
    }
    setIsRecording(true);
    recorder.setOnStop(onStopRecording);
    recorder.record();
  };

  const stopRecording = () => {
    recorder.stop();
    setIsRecording(false);
  };

  const onStopRecording =  () => {
    setIsProcessing(true);
    worker.postMessage({
      action: 'tunerInit',
      args: [
        recorder.getRecordedAudio(),
        recorder.getSampleRate(),
        recorder.getNumChannels(),
        Number(windowSize),
        Number(osamp),
        scaleBaseNote,
        scaleName,
      ],
    });
  };

  const onClickPlayOriginal = () => originalSound.play();
  const onClickPlayCorrected = () => correctedSound.play();

  const onChangeScaleBaseNote = (e) => setScaleBaseNote(e.target.value);
  const onChangeScaleName = (e) => setScaleName(e.target.value);
  const onChangeWindowSize = (e) => setWindowSize(e.target.value);
  const onChangeOsamp = (e) => setOsamp(e.target.value);

  const onClickReautotone = () => {
    setIsProcessing(true);
    worker.postMessage({
      action: 'tunerRetone',
      args: [
        Number(windowSize),
        Number(osamp),
        scaleBaseNote,
        scaleName,
      ]
    });
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.recordButton} onClick={onClickRecord}>
        {isRecording ? 'Stop' : 'Record'}
      </div>
      
      <div>
        <select onChange={onChangeScaleBaseNote} value={scaleBaseNote}>
          {NOTES.map((note, index) => (
            <option key={index} value={note}>{note}</option>
          ))}
        </select>
        <select onChange={onChangeScaleName} value={scaleName}>
          {SCALE_TYPES.map(({ name }) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input type='number' onChange={onChangeWindowSize} value={windowSize} />
        <input type='number' onChange={onChangeOsamp} value={osamp} />
      </div>

      {(!isRecording && !isProcessing && originalSound && correctedSound) ? (
        <div>
          <div className={styles.playButton} onClick={onClickPlayOriginal}>
            Play original
          </div>
          <div className={styles.playButton} onClick={onClickPlayCorrected}>
            Play autotoned
          </div>
          <div onClick={onClickReautotone}>
            Re-autotone
          </div>
        </div>
      ) : null}

      {isProcessing ? <div>Loading...</div> : null}
    </div>
  );
}

export default App;
