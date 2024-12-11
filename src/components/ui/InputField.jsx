import React from 'react';
import styles from './InputField.module.css';

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  isTextArea,
}) => {
  return (
    <div className={styles.inputBox}>
      <div className={styles.inputBoxDiv}>
        <label htmlFor={name} className={styles.inputBoxLabel}>
          {label}
        </label>
      </div>
      <div className={styles.inputBoxDiv}>
        {isTextArea ? (
          <textarea
            id={name}
            name={name}
            className={styles.textArea}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            cols="30"
          ></textarea>
        ) : (
          <input
            id={name}
            type="text"
            name={name}
            className={styles.inputBoxInput}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
