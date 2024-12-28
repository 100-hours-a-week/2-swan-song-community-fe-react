import { useState } from 'react';

function useFetch() {
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = async (apiUrl, hasNext = true, params = {}) => {
    if (!hasNext || isFetching) return;
    setIsFetching(true);

    const paramsWithoutNull = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== null),
    );

    try {
      const url = `${apiUrl}?${new URLSearchParams(paramsWithoutNull).toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('게시글 로딩 중 오류 발생');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, fetchData };
}

export default useFetch;
