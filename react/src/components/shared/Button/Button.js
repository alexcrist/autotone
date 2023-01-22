import { classNames } from '../../../utils/reactUtils.js';
import styles from './Button.css';

export const Button = ({
  className,
  onClick,
  disabled,
  Icon,
  large,
  small,
  secondary,
}) => {
  return (
    <div 
      onClick={onClick}
      className={classNames(
        className,
        styles.button,
        (disabled && styles.disabled),
        (large && styles.large),
        (small && styles.small),
        (secondary && styles.secondary),
      )
    }>
      <div className={styles.icon}>
        <Icon
          size={
            (large && 24) ||
            (small && 16)  
          }
        />
      </div>
    </div>
  );
};
