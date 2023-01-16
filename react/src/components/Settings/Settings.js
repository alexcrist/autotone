import { useEffect, useState } from 'react';
import { DEFAULT_BASE_NOTE, DEFAULT_SCALE_NAME } from '../../audio/autotone/autotoneConstants';
import { NOTES, SCALE_TYPES } from '../../audio/music/musicScales';
import { DEFAULT_TUNER_OSAMP, DEFAULT_TUNER_WINDOW_SIZE } from '../../audio/pitchShifting/tunerConstants';
import { Card } from '../shared/Card/Card';
import { Select } from '../shared/Select/Select';
import { Text } from '../shared/Text/Text';
import styles from './Settings.css';

export const Settings = ({ 
  originalAudio, 
  reAutotone,
  getAutotoner,
}) => {

  const [scaleBaseNote, setScaleBaseNote] = useState(DEFAULT_BASE_NOTE);
  const [scaleName, setScaleName] = useState(DEFAULT_SCALE_NAME);
  const [tunerWindowSize, setTunerWindowSize] = useState(DEFAULT_TUNER_WINDOW_SIZE);
  const [tunerOsamp, setTunerOsamp] = useState(DEFAULT_TUNER_OSAMP);

  useEffect(() => {
    const autotoner = getAutotoner();
    autotoner.setScale(scaleBaseNote, scaleName);
    autotoner.setTunerWindowSize(tunerWindowSize);
    autotoner.setTunerOsamp(tunerOsamp);
    if (originalAudio) {
      reAutotone();
    }
  }, [
    scaleBaseNote,
    scaleName,
    tunerWindowSize,
    tunerOsamp,
  ]);

  return (
    <Card className={styles.card}>

      <div className={styles.block}>
        <Text className={styles.text}>
          Scale
        </Text>
        <div className={styles.row}>
          <div>
           <Text className={styles.smallText}>
              Tonic
            </Text>
            <Select
              options={NOTES}
              value={scaleBaseNote}
              setValue={setScaleBaseNote}
            />
          </div>
          <div>
           <Text className={styles.smallText}>
              Mode
            </Text>
            <Select
              options={SCALE_TYPES.map((scale) => scale.name)}
              value={scaleName}
              setValue={setScaleName}
            />
          </div>
        </div>
      </div>

      <div className={styles.block}>
        <Text className={styles.text}>
          Pitch shifting
        </Text>
        <div className={styles.row}>
          <div>
            <Text className={styles.smallText}>
              Window size
            </Text>
            <Select
              options={powerOfTwos(5, 13)}
              value={tunerWindowSize}
              setValue={setTunerWindowSize}
            />
          </div>
          <div>
            <Text className={styles.smallText}>
              Over-sampling
            </Text>
            <Select
              options={powerOfTwos(1, 10)}
              value={tunerOsamp}
              setValue={setTunerOsamp}
            />
          </div>
        </div>
      </div>
      
    </Card>
  );
};

const powerOfTwos = (smallExponent, bigExponent) => {
  let values = [];
  for (let i = smallExponent; i <= bigExponent; i++) {
    values.push(Math.pow(2, i));
  }
  return values;
};