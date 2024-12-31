// React 라이브러리
import React from 'react';

// 프로젝트 내부 컴포넌트
import Modal from './Modal.jsx';

// 스타일 파일 (CSS Modules)
import styles from './RemoveModal.module.css';

const RemoveModal = ({ isOpen, onClose, onConfirm, message, children }) => {
  const customStyle = {
    cancelButton: styles.cancelButton,
    confirmButton: styles.confirmButton,
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      message={message}
      customeStyles={customStyle}
    >
      {children}
    </Modal>
  );
};

export default RemoveModal;
