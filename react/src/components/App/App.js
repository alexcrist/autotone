import { useEffect, useState } from 'react';
import { Autotoner } from '../../audio/autotone/Autotoner.js';
import { Player } from '../Player/Player.js';
import { Record } from '../Record/Record.js';
import { Settings } from '../Settings/Settings.js';
import { Text } from '../shared/Text/Text.js';
import styles from './App.css';

const autotoner = new Autotoner();

export const App = () => {
  
  const [isReady, setIsReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMicAccessible, setIsMicAccessible] = useState(true);
  const [originalAudio, setOriginalAudio] = useState(null);
  const [autotonedAudio, setAutotonedAudio] = useState(null);

  useEffect(() => {
    autotoner
      .init()
      .then(() => setIsReady(true))
      .catch(() => setIsMicAccessible(false));
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

  const reAutotone = async () => {
    setOriginalAudio(null);
    setAutotonedAudio(null);
    setIsProcessing(true);
    await autotoner.autotone();
    setIsProcessing(false);
    setOriginalAudio(autotoner.getOriginalAudio());
    setAutotonedAudio(autotoner.getAutotonedAudio());
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Text className={styles.title}>
            Autotone
          </Text>
          <Text className={styles.description}>
            A vocal pitch correction web application
          </Text>
        </div>
        <a className={styles.link} href="https://github.com/alexcrist/autotone" target="_blank">
          the code
        </a>
      </div>
      <div className={styles.row}>
        <Record
          isReady={isReady}
          isRecording={isRecording}
          isProcessing={isProcessing}
          isMicAccessible={isMicAccessible}
          record={record}
          stopRecording={stopRecording}
        />
        <Settings 
          originalAudio={originalAudio}
          reAutotone={reAutotone}
          getAutotoner={() => autotoner}
        />
      </div>
      <Player
        title='Original audio'
        audio={originalAudio}
        getSampleRate={() => autotoner.getSampleRate()}
        getFreqs={() => autotoner.getOriginalFreqs()}
        getConfidences={() => autotoner.getConfidences()}
        isProcessing={isProcessing}
        color='#0049B6'
      />
      <Player
        title='Autotoned audio'
        audio={autotonedAudio}
        getSampleRate={() => autotoner.getSampleRate()}
        getFreqs={() => autotoner.getAutotonedFreqs()}
        getConfidences={() => autotoner.getConfidences()}
        isProcessing={isProcessing}
        color='#FF1D58'
      />
    </div>
  );
};
