import { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [size] = useState(5); // 한 번에 가져올 게시글 수
  const [lastId, setLastId] = useState(null); // 마지막 ID (페이징)
  const [hasNext, setHasNext] = useState(true); // 다음 데이터 여부
  const [posts, setPosts] = useState([]);

  const removePost = postId => {
    setPosts(prev => prev.filter(post => post.postId !== postId));
  };

  return (
    <PostContext.Provider
      value={{
        size,
        lastId,
        hasNext,
        posts,
        setLastId,
        setHasNext,
        setPosts,
        removePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
