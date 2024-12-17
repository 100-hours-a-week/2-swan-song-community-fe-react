// React 라이브러리
import React from 'react';

// 외부 라이브러리
import classNames from 'classnames';

// 프로젝트 내부 컴포넌트
import HelperText from './HelperText';

// 스타일 파일 (CSS Modules)
import styles from './InputField.module.css';

const InputField = ({
  label,
  name,
  value,
  type,
  onChange,
  placeholder,
  isTextArea,
  helperMessage,
  isError,
  className,
  readOnly,
}) => {
  return (
    <div
      className={classNames(
        styles.inputBox,
        className?.inputBox && className.inputBox,
      )}
    >
      <label
        htmlFor={name}
        className={classNames(
          styles.inputBoxLabel,
          className?.inputBoxLabel && className.inputBoxLabel,
        )}
      >
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          className={classNames(
            styles.textArea,
            className?.textArea && className.textArea,
          )}
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
          className={classNames(
            styles.inputBoxInput,
            className?.inputBoxInput && className.inputBoxInput,
            readOnly && styles.readOnly,
          )}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      )}
      {helperMessage && (
        <HelperText isError={isError} helperMessage={helperMessage} />
      )}
    </div>
  );
};

export default InputField;
