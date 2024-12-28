// React 라이브러리
import React from 'react';

// 프로젝트 내부 컴포넌트
import PostItem from './PostItem';

// CSS Modules 스타일 파일
import styles from './PostList.module.css';

const PostList = ({ posts }) => {
  return (
    <div className={styles.postList}>
      {posts.map(post => (
        <PostItem key={post.postId} post={post} />
      ))}
    </div>
  );
};

export default PostList;
