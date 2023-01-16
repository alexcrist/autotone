import { classNames } from '../../../utils/reactUtils.js';
import styles from './Card.css';

export const Card = ({ className, children }) => {
  return (
    <div className={classNames(
      className,
      styles.card,
    )}>
      {children}
    </div>
  );
};