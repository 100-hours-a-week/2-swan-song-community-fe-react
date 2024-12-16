import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, onConfirm, message, children }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackground} onClick={handleBackgroundClick}>
      <div className={styles.modalContent}>
        <h4>{message}</h4>
        {children && <div className={styles.modalBody}>{children}</div>}
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button className={styles.confirmButton} onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
