import { useState } from 'react';
import styles from './App.module.css';
import * as recorder from '../../audio/recorder.js';
import * as player from '../../audio/player.js';

const App = () => {

  const [isRecording, setIsRecording] = useState(false);
  const [originalAudio, setOriginalAudio] = useState(null);
  const [modifiedAudio, setModifiedAudio] = useState(null);

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
    recorder.setOnStop(async () => {
      const data = recorder.getRecordedAudio();
      const rate = recorder.getSampleRate();
      const numChannels = recorder.getNumChannels();
      const sound = player.makeSound(data, rate, numChannels);
      setOriginalAudio({ data, rate, numChannels, sound });
    });
    recorder.record();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorder.stop();
    setIsRecording(false);
  };

  const onClickPlayOriginal = () => {
    originalAudio.sound.play();    
  };

  const onClickPlayModified = () => {

  };

  return (
    <div className={styles.container}>
      <div
        className={styles.recordButton}
        onClick={onClickRecord}
      >
        {isRecording ? 'Stop' : 'Record'}
      </div>
      {originalAudio && 
        <div
          className={styles.playButton}
          onClick={onClickPlayOriginal}
        >
          Play original
        </div>
      }
    </div>
  );
}

export default App;
