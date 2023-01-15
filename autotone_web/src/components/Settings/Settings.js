import { useEffect, useState } from 'react';
import { DEFAULT_BASE_NOTE, DEFAULT_SCALE_NAME } from '../../audio/autotone/autotoneConstants';
import { getScaleFreqs, NOTES, SCALE_TYPES } from '../../audio/music/musicScales';
import { PITCH_SHIFTING_OSAMP, PITCH_SHIFTING_WINDOW_SIZE } from '../../audio/pitchShifting/tunerConstants';
import { Button } from '../shared/Button/Button';
import { Card } from '../shared/Card/Card';
import { Select } from '../shared/Select/Select';
import { Text } from '../shared/Text/Text';
import styles from './Settings.css';
import { FaArrowRight } from 'react-icons/fa';

export const Settings = ({ 
  originalAudio, 
  setAutotonerScale,
  setAutotonerWindowSize,
  setAutotonerOsamp,
  autotone
}) => {

  const [scaleBaseNote, setScaleBaseNote] = useState(DEFAULT_BASE_NOTE);
  const [scaleName, setScaleName] = useState(DEFAULT_SCALE_NAME);
  const [windowSize, setWindowSize] = useState(PITCH_SHIFTING_WINDOW_SIZE);
  const [osamp, setOsamp] = useState(PITCH_SHIFTING_OSAMP);

  useEffect(() => {
    setAutotonerScale(scaleBaseNote, scaleName);
    setAutotonerWindowSize(Number(windowSize));
    setAutotonerOsamp(Number(osamp));
  }, [scaleBaseNote, scaleName, windowSize, osamp]);

  const onClickAutotone = () => {
    if (originalAudio) {
      autotone();
    }
  };

  return (
    <Card flex>
      <Text>
        Scale
      </Text>
      <div className={styles.row}>
        <Select
          options={NOTES}
          value={scaleBaseNote}
          setValue={setScaleBaseNote}
        />
        <Select
          options={SCALE_TYPES.map((scale) => scale.name)}
          value={scaleName}
          setValue={setScaleName}
        />
      </div>
      <Text>
        Window size (pitch shifting)
      </Text>
      <div className={styles.row}>
        <Select
          options={powerOfTwos(5, 13)}
          value={windowSize}
          setValue={setWindowSize}
        />
      </div>
      <Text>
        Over-sampling factor (pitch shifting)
      </Text>
      <div className={styles.row}>
        <Select
          options={powerOfTwos(1, 10)}
          value={osamp}
          setValue={setOsamp}
        />
      </div>
      <Button
        small
        onClick={onClickAutotone}
        disabled={!originalAudio}
        Icon={FaArrowRight}
      />
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