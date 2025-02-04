// React 및 React Hooks
import React, { useEffect, useState, useRef, useCallback } from "react";

// 프로젝트 내부 컴포넌트
import BoardHeader from "../components/board/BoardHeader";
import BoardAction from "../components/board/BoardAction.jsx";
import PostList from "../components/board/PostList.jsx";
import WithAuthenticated from "../components/HOC/WithAuthenticated.jsx";
import LoadingUI from "../components/LoadingUI.jsx";

// TanStack Query
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 상수 및 환경 변수
import { API_BASE_URL } from "../constants/api";

// 스타일 파일 (CSS Modules)
import styles from "./Index.module.css";

function Index() {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const queryClient = useQueryClient();

  // 게시글 가져오는 함수
  const fetchPosts = async ({ pageParam = null }) => {
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      params: { size: 8, lastId: pageParam },
      withCredentials: true,
    });
    return response.data.data; // API 구조에 맞게 `.data.data`를 반환
  };

  // TanStack Query의 useInfiniteQuery 설정
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["fetchPosts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.lastId : undefined),
    cacheTime: 1000 * 60 * 10, // 10분 동안 캐싱 유지
  });

  // Intersection Observer를 통한 무한스크롤 트리거
  const observer = useRef();
  const triggerRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  // 스크롤 버튼 표시 여부
  const handleScroll = () => {
    setShowScrollButton(window.scrollY > 200);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.board}>
      <BoardHeader />
      <BoardAction />
      <PostList posts={data?.pages.flatMap((page) => page.content) ?? []} />
      <LoadingUI isFetching={isFetching} />
      <div
        ref={triggerRef}
        style={{ height: "50px", backgroundColor: "transparent" }}
      ></div>
      {showScrollButton && (
        <button className={styles.scrollToTopButton} onClick={scrollToTop}>
          ▲
        </button>
      )}
    </div>
  );
}

export default WithAuthenticated(Index);