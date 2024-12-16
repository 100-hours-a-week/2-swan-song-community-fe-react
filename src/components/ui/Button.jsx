import React from 'react';
import styles from './Button.module.css';

const Button = ({
  isValid = true,
  label,
  onClick,
  className,
  type = 'button',
  children,
  ...props
}) => {
  return (
    <button
      className={`${styles.defaultBtn} ${className || ''}`}
      type={type}
      disabled={!isValid}
      onClick={onClick}
      {...props}
    >
      {label}
      {children}
    </button>
  );
};

export default Button;
