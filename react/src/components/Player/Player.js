import { FaDownload, FaPlay } from 'react-icons/fa';
import * as player from '../../audio/player/player.js';
import { downloadWavFile } from '../../utils/ioUtils.js';
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
  getNumChannels,
  color,
}) => {
  if (!audio) {
    return null;
  }

  const onClickPlay = () => {
    player.play(audio, getSampleRate());
  };

  const onClickDownload = () => {
    const fileName = `${title}.wav`.toLowerCase().replaceAll(' ', '-');
    downloadWavFile(audio, getSampleRate(), 1, fileName);
  };

  return (
    <Card>
      <Text>
        {title}
      </Text>
      <div className={styles.audio}>
        <div className={styles.buttons}>
          <Button
            small
            onClick={onClickPlay}
            Icon={FaPlay}
            className={styles.button}
          />
          <Button
            small
            secondary
            onClick={onClickDownload}
            Icon={FaDownload}
            className={styles.button}
          />
        </div>
        <Chart 
          freqs={getFreqs()} 
          confidences={getConfidences()}
          color={color}
        />
      </div>
    </Card>
  );
};