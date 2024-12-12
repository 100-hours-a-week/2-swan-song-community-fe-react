import classNames from 'classnames';
import styles from './HelperText.module.css';

export default function helperText({ errorClassName, error }) {
  return (
    <span
      className={classNames(
        !errorClassName ? styles.helperText : styles.success,
      )}
    >
      {error}
    </span>
  );
}
