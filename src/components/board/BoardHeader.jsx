import React from 'react';
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
