// React 라이브러리
import React, { useState } from 'react';

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
  type = 'text',
  onChange,
  placeholder = '',
  isTextArea = false,
  helperMessage,
  isError = false,
  className = {},
  readOnly = false,
}) => {
  const [isTouched, setIsTouched] = useState(false);

  const handleFocus = () => setIsTouched(true);

  // 공통 속성 정의
  const sharedProps = {
    id: name,
    name,
    value,
    onChange,
    placeholder,
    readOnly,
    onFocus: handleFocus,
    className: classNames(
      isTextArea ? styles.textArea : styles.inputBoxInput,
      readOnly && styles.readOnly,
      className[isTextArea ? 'textArea' : 'inputBoxInput'],
    ),
  };

  return (
    <div className={classNames(styles.inputBox, className.inputBox)}>
      {label && (
        <label
          htmlFor={name}
          className={classNames(styles.inputBoxLabel, className.inputBoxLabel)}
        >
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea {...sharedProps} cols="30"></textarea>
      ) : (
        <input {...sharedProps} type={type} />
      )}
      {isTouched && helperMessage && (
        <HelperText isError={isError} helperMessage={helperMessage} />
      )}
    </div>
  );
};

export default InputField;
