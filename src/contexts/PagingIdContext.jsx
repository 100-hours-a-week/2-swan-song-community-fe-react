import { createContext, useContext, useState } from 'react';

const PagingIdContext = createContext();

export const PagingIdProvider = ({ children }) => {
  const [size] = useState(5); // 한 번에 가져올 게시글 수
  const [lastId, setLastId] = useState(null); // 마지막 ID (페이징)
  const [hasNext, setHasNext] = useState(true); // 다음 데이터 여부
  const [posts, setPosts] = useState([]);

  return (
    <PagingIdContext.Provider
      value={{ size, lastId, hasNext, posts, setLastId, setHasNext, setPosts }}
    >
      {children}
    </PagingIdContext.Provider>
  );
};

export const usePagingId = () => useContext(PagingIdContext);
