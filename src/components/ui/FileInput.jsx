import React from 'react';
import styles from './FileInput.module.css';

const FileInput = ({ label, name, onChange }) => {
  return (
    <div className={styles.inputBox}>
      <div className={styles.imageContainer}>
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          type="file"
          name={name}
          onChange={onChange}
          className={styles.fileInput}
        />
      </div>
    </div>
  );
};

export default FileInput;
