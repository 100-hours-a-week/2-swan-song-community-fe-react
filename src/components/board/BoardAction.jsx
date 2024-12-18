// React 및 React Router 라이브러리
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 프로젝트 내부 컴포넌트
import Button from '../ui/Button.jsx';

// CSS Modules 스타일 파일
import styles from './BoardAction.module.css';

const BoardAction = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.boardAction}>
      <Button
        label="게시글 작성"
        type="button"
        onClick={() => navigate('/post-upload')}
        className={styles.btnSubmit}
      />
    </div>
  );
};

export default BoardAction;
