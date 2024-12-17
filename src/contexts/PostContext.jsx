// React 및 React Hooks
import { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [size, setSize] = useState(null); // 페이지 크기 (페이징)
  const [lastId, setLastId] = useState(null); // 마지막 ID (페이징)
  const [hasNext, setHasNext] = useState(true); // 다음 데이터 여부

  const adjustUpdatingUser = user => {
    const updatedPosts = posts.map(post => {
      if (post.author.id === user.id) {
        return { ...post, author: user };
      } else {
        return post;
      }
    });
    setPosts(updatedPosts);
  };

  const removePost = postId => {
    setPosts(prev => prev.filter(post => post.postId !== postId));
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        size,
        lastId,
        setLastId,
        hasNext,
        setHasNext,
        removePost,
        adjustUpdatingUser,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
