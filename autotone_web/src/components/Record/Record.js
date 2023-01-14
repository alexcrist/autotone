import styles from './Record.css';
import { FaStop, FaCircle } from 'react-icons/fa';

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

  const icon = isRecording ? <FaStop /> : <FaCircle />;
  
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
    <div className={styles.container}>
      <div className={styles.text}>
        {text}
      </div>
      <div 
        className={styles.button} 
        disabled={!isReady}
        onClick={onClick}
      >
        <div className={styles.icon}>
          {icon}
        </div>
      </div>
    </div>
  );
};