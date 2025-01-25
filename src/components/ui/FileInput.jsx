// React 라이브러리
import React from 'react';

// 스타일 파일 (CSS Modules)
import styles from './FileInput.module.css';

const FileInput = ({ label, name, onChange, accept = "image/*" }) => {
  return (
    <div className={styles.inputBox}>
      <div className={styles.imageContainer}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          type="file"
          accept={accept}
          name={name}
          onChange={onChange}
          className={styles.fileInput}
        />
      </div>
    </div>
  );
};

export default FileInput;
