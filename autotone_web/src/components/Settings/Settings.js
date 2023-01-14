import { Card } from '../shared/Card/Card';
import { Text } from '../shared/Text/Text';
import styles from './Settings.css';

export const Settings = ({ 
  originalAudio, 
  setScale,
  setWindowSize,
  setOsamp,
  autotone
}) => {



  // const onClickReAutotone = () => {

  // };


  return (
    <Card flex>
      <Text>
        Scale
      </Text>
      <div className={styles.scale}>
        <select></select>
      </div>
    </Card>
  );
};