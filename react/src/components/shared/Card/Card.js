import { classNames } from '../../../utils/reactUtils.js';
import styles from './Card.css';

export const Card = ({ className, children, flex }) => {
  return (
    <div className={classNames(
      className,
      styles.card,
      (flex && styles.flex)
    )}>
      {children}
    </div>
  );
};