import { useEffect, useState } from 'react';
import { Autotoner } from '../../audio/autotone/Autotoner.js';
import { Player } from '../Player/Player.js';
import { Record } from '../Record/Record.js';
import { Settings } from '../Settings/Settings.js';
import styles from './App.css';

const autotoner = new Autotoner();

export const App = () => {
  
  const [isReady, setIsReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalAudio, setOriginalAudio] = useState(null);
  const [autotonedAudio, setAutotonedAudio] = useState(null);

  useEffect(() => {
    autotoner.init().then(() => setIsReady(true));
  }, []);

  const record = () => {
    setIsRecording(true);
    setOriginalAudio(null);
    setAutotonedAudio(null);
    autotoner.record();
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    await autotoner.stopRecording();
    setIsProcessing(false);
    setOriginalAudio(autotoner.getOriginalAudio());
    setAutotonedAudio(autotoner.getAutotonedAudio());
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Record
          isReady={isReady}
          isRecording={isRecording}
          record={record}
          stopRecording={stopRecording}
        />
        <Settings 
          originalAudio={originalAudio}
          setScale={autotoner.setScale}
          autotone={autotoner.autotone}
        />
      </div>
      <Player
        title='Original audio'
        audio={originalAudio}
        getSampleRate={() => autotoner.getSampleRate()}
        getFreqs={() => autotoner.getOriginalFreqs()}
        isProcessing={isProcessing}
      />
      <Player
        title='Autotoned audio'
        audio={autotonedAudio}
        getSampleRate={() => autotoner.getSampleRate()}
        getFreqs={() => autotoner.getAutotonedFreqs()}
        isProcessing={isProcessing}
      />
      <div className={styles.footer}>
        <a 
          href="https://github.com/alexcrist/autotone"
          target="_blank"
        >
          See the code
        </a>
      </div>
    </div>
  );
};
