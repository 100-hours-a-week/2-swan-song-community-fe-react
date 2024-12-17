import React, { useEffect, useState, useRef } from 'react';
import BoardHeader from '../components/board/BoardHeader';
import BoardAction from '../components/board/BoardAction.jsx';
import PostList from '../components/board/PostList.jsx';
import { API_BASE_URL } from '../constants/api';
import { usePostContext } from '../contexts/PostContext.jsx';
import styles from './Index.module.css';

export default function Index() {
  const { posts, setPosts, size, lastId, setLastId, hasNext, setHasNext } = usePostContext();
  const [isFetching, setIsFetching] = useState(false); // API 호출 중인지 확인
  const observerRef = useRef(null); // Intersection Observer를 위한 ref
  const triggerRef = useRef(null); // 트리거 요소를 위한 ref

  const fetchPosts = async () => {
    if (!hasNext || isFetching) return; // 더 가져올 데이터가 없거나 로딩 중이면 종료

    setIsFetching(true); // 로딩 시작 (중복 호출 방지)
    try {
      const params = new URLSearchParams();
      if (size) params.append('size', size);
      if (lastId) params.append('lastId', lastId);

      const url = `${API_BASE_URL}/posts${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();
      if (data.code === 2000) {
        setPosts(prev => [...prev, ...data.data.content]);
        setHasNext(data.data.hasNext);
        setLastId(data.data.lastId);
      }
    } catch (error) {
      console.error('게시글 로딩 중 오류 발생:', error);
    } finally {
      setIsFetching(false); // 로딩 종료
    }
  };

  useEffect(() => {
    const observerCallback = entries => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetching) {
        fetchPosts(); // 트리거 요소가 보이고, 사용자가 스크롤한 경우만 호출
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 1.0, // 트리거 요소가 완전히 보일 때 호출
    });

    if (triggerRef.current) {
      observerRef.current.observe(triggerRef.current); // 트리거 요소 관찰 시작
    }

    return () => {
      if (observerRef.current && triggerRef.current) {
        observerRef.current.unobserve(triggerRef.current); // 클린업
      }
    };
  }, [isFetching, hasNext]); // 최신 상태를 반영하기 위해 isFetching, hasNext 를 의존성 배열에 추가

  return (
    <div className={styles.board}>
      <BoardHeader />
      <BoardAction />
      <PostList posts={posts} />
      <div
        ref={triggerRef}
        style={{ height: '50px', backgroundColor: 'transparent' }}
      ></div>
      {isFetching && <div>Loading...</div>}
    </div>
  );
}
