import styles from './Settings.css';

export const Settings = ({ 
  originalAudio, 
  setScale,
  autotone
}) => {



  // const onClickReAutotone = () => {

  // };

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        Scale
      </div>
      <div className={styles.scale}>
        <select></select>
      </div>
    </div>
  );
};