import { FaCircle, FaStop } from 'react-icons/fa';
import { Button } from '../shared/Button/Button.js';
import { Card } from '../shared/Card/Card.js';
import { Text } from '../shared/Text/Text.js';
import styles from './Record.css';

export const Record = ({
  isReady,
  isRecording,
  record,
  stopRecording,
}) => {

  let text;
  if (!isReady) {
    text = 'Loading Autotoner model...';
  } else if (!isRecording) {
    text = 'Ready to record';
  } else {
    text = 'Recording...';
  }

  const onClick = () => {
    if (!isReady) {
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
        large 
        onClick={onClick}
        Icon={isRecording ? FaStop : FaCircle}
        disabled={!isReady}
      />
    </Card>
  );
};