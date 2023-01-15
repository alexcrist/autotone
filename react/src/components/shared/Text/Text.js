import { classNames } from '../../../utils/reactUtils';
import styles from './Text.css';

export const Text = ({ className, children, center }) => {
  return (
    <div 
      className={classNames(
        className, 
        styles.text, 
        (center && styles.center)
      )}
    >
      {children}
    </div>
  );
};