import React from 'react';
import styles from './SubmitButton.module.css';

const SubmitButton = ({ isValid, label }) => {
  return (
    <div className={styles.btnBox}>
      <button
        className={`${styles.postUploadBtn} ${styles.submitBtn}`}
        type="submit"
        disabled={!isValid}
      >
        {label}
      </button>
    </div>
  );
};

export default SubmitButton;
