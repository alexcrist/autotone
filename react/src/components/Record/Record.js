import { FaCircle, FaStop } from 'react-icons/fa';
import { Button } from '../shared/Button/Button.js';
import { Card } from '../shared/Card/Card.js';
import { Text } from '../shared/Text/Text.js';
import styles from './Record.css';

export const Record = ({
  isReady,
  isRecording,
  isProcessing,
  isMicAccessible,
  record,
  stopRecording,
}) => {

  const isDisabled = !isReady || isProcessing;

  let text;
  if (!isMicAccessible) {
    text = 'Microphone inaccessible.';
  } else if (!isReady) {
    text = 'Loading CREPE model...';
  } else if (isProcessing) {
    text = 'Processing...';
  } else if (isRecording) {
    text = 'Recording...';
  } else {
    text = 'Ready to record';
  }

  const onClick = () => {
    if (isDisabled) {
      return;
    }
    if (isRecording) {
      stopRecording();
    } else {
      record();
    }
  }

  return (
    <Card className={styles.card}>
      <Text center>
        {text}
      </Text>
      <Button
        className={styles.button}
        large 
        onClick={onClick}
        Icon={isRecording ? FaStop : FaCircle}
        disabled={isDisabled}
      />
    </Card>
  );
};