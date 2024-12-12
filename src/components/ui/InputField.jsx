import React from 'react';
import classNames from 'classnames';
import styles from './InputField.module.css';

const InputField = ({
  label,
  name,
  value,
  type,
  onChange,
  placeholder,
  isTextArea,
  error,
  errorClassName,
  className,
}) => {
  return (
    <div className={classNames(styles.inputBox, (className?.inputBox ? className.inputBox : undefined))}>
      <label htmlFor={name} className={classNames(styles.inputBoxLabel, (className?.inputBoxLabel ? className.inputBoxLabel : undefined))}>
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          className={classNames(styles.textArea, (className?.textArea ? className.textArea : undefined))}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          cols="30"
        ></textarea>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          className={classNames(styles.inputBoxInput, (className?.inputBoxInput ? className.inputBoxInput : undefined))}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {error && <span className={ (!errorClassName ? styles.helperText : styles.success) }>{error}</span>}
    </div>
  );
};

export default InputField;