// React 라이브러리
import React from 'react';

// CSS Modules 스타일 파일
import styles from './BoardHeader.module.css';

const BoardHeader = () => {
  return (
    <div className={styles.boardHeader}>
      <div>
        <span className={styles.textRegular}>컴퓨터 매니아 </span>
        <span className={styles.textLighter}>들을 위한 곳입니다.</span>
      </div>
      <div className={styles.textLighter}>안녕하세요</div>
    </div>
  );
};

export default BoardHeader;
