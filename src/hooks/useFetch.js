import { useState } from 'react';

function useFetch() {
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = async (apiUrl, hasNext = true, params, onSuccess, onError) => {
    if (!hasNext || isFetching) return;
    setIsFetching(true);

    const paramsWithoutNull = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== null)
    );

    try {
      const url = `${apiUrl}?${new URLSearchParams(paramsWithoutNull).toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
      } else {
        throw new Error('데이터 로드에 실패했습니다.');
      }
    } catch (error) {
      if (onError) onError(error);
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, fetchData };
}

export default useFetch;