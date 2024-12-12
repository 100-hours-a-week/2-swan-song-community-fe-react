import React from 'react';
import styles from './PostList.module.css';
import PostItem from './PostItem';

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
