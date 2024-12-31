// React 라이브러리
import React from 'react';

// 스타일 파일 (CSS Modules)
import styles from './SubmitButton.module.css';

const SubmitButton = ({
  isValid = true,
  label,
  onClick,
  className,
  type = 'submit',
}) => {
  return (
      <button
        className={`${styles.submitBtn} ${className || ''}`}
        type={type}
        disabled={!isValid}
        onClick={onClick}
      >
        {label}
      </button>
  );
};

export default SubmitButton;
