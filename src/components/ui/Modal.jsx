// React 라이브러리
import React from 'react';

// 외부 라이브러리
import classNames from 'classnames';

// 스타일 파일 (CSS Modules)
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, onConfirm, message, children, customeStyles }) => {
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
          <button className={classNames(styles.cancelButton, customeStyles?.cancelButton)} onClick={onClose}>
            취소
          </button>
          <button className={classNames(styles.confirmButton, customeStyles?.confirmButton)} onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
