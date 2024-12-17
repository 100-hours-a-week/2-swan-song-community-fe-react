import classNames from 'classnames';
import styles from './HelperText.module.css';

export default function helperText({ isError = true, helperMessage }) {
  return (
    <span
      className={classNames(
        isError ? styles.error : styles.success,
      )}
    >
      {helperMessage}
    </span>
  );
}
