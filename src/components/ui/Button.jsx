import React from 'react';
import styles from './Button.module.css';

const Button = ({
  isValid = true,
  label,
  onClick,
  className,
  type = 'button',
}) => {
  return (
    <button
      className={`${styles.defaultBtn} ${className || ''}`}
      type={type}
      disabled={!isValid}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
