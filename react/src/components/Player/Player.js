import { FaPlay } from 'react-icons/fa';
import * as player from '../../audio/player/player.js';
import { Chart } from '../Chart/Chart.js';
import { Button } from '../shared/Button/Button.js';
import { Card } from '../shared/Card/Card.js';
import { Text } from '../shared/Text/Text.js';
import styles from './Player.css';

export const Player = ({
  title,
  audio,
  getFreqs,
  getConfidences,
  getSampleRate,
  color,
}) => {
  if (!audio) {
    return null;
  }

  const onClickPlay = () => {
    player.play(audio, getSampleRate());
  };

  return (
    <Card>
      <Text>
        {title}
      </Text>
      <div className={styles.audio}>
        <Button
          small
          onClick={onClickPlay}
          Icon={FaPlay}
          className={styles.button}
        />
        <Chart 
          freqs={getFreqs()} 
          confidences={getConfidences()}
          color={color}
        />
      </div>
    </Card>
  );
};