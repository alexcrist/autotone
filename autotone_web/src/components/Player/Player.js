import { FaPlay } from 'react-icons/fa';
import styles from './Player.css';
import * as player from '../../audio/player/player.js';

export const Player = ({
  title,
  audio,
  getFreqs,
  getSampleRate
}) => {
  if (!audio) {
    return null;
  }

  const onClickPlay = () => {
    console.log('play', audio, getSampleRate());
    player.play(audio, getSampleRate());
  };

  const chartData = {
    datasets: [
      {
        data: Array.from(getFreqs())
      },
      {
        data: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        {title}
      </div>
      <div className={styles.audio}>
        <div 
          className={styles.button}
          onClick={onClickPlay}
        >
          <div className={styles.icon}>
            <FaPlay />
          </div>
        </div>
        <div className={styles.graph}>
          TODO: insert frequency chart
        </div>
      </div>
    </div>
  );
};