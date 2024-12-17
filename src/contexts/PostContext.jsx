import { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

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
        removePost,
        adjustUpdatingUser,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
