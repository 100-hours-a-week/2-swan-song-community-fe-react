// React 라이브러리
import React from 'react';

// CSS Modules 스타일 파일
import styles from './BoardHeader.module.css';

const BoardHeader = () => {
  return (
    <div className={styles.boardHeader}>
      <div>안녕하세요,</div>
      <div>
        아무 말 대잔치<span className={styles.textBold}> 게시판</span>입니다.
      </div>
    </div>
  );
};

export default BoardHeader;
