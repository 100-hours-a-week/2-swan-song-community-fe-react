// 외부 라이브러리
import classNames from 'classnames';

// 스타일 파일 (CSS Modules)
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
