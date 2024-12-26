// React 및 React Hooks
import React, { useEffect, useState, useRef } from 'react';

// 프로젝트 내부 컴포넌트
import BoardHeader from '../components/board/BoardHeader';
import BoardAction from '../components/board/BoardAction.jsx';
import PostList from '../components/board/PostList.jsx';
import WithAuthenticated from '../components/HOC/WithAuthenticated.jsx';

// 커스텀 훅
import useFetch from '../hooks/useFetch';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api';

// 전역 상태 및 컨텍스트
import { usePostContext } from '../contexts/PostContext.jsx';

// 스타일 파일 (CSS Modules)
import styles from './Index.module.css';

function Index() {
  const { posts, setPosts, size, lastId, setLastId, hasNext, setHasNext } =
    usePostContext();

  const { isFetching, fetchData } = useFetch();

  const loadPosts = () => {
    if (!hasNext || isFetching) return;

    fetchData(
      `${API_BASE_URL}/posts`,
      hasNext,
      { size, lastId },
      (data) => {
        setPosts((prev) => [...prev, ...data.data.content]);
        setHasNext(data.data.hasNext);
        setLastId(data.data.lastId);
      },
      (error) => {
        console.error('게시글 로딩 중 오류 발생:', error);
      }
    );
  };

  const triggerRef = useIntersectionObserver(loadPosts, isFetching,{
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  });

  if (isFetching) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.board}>
      <BoardHeader />
      <BoardAction />
      <PostList posts={posts} />
      <div
        ref={triggerRef}
        style={{ height: '50px', backgroundColor: 'transparent' }}
      ></div>
    </div>
  );
}

export default WithAuthenticated(Index);
