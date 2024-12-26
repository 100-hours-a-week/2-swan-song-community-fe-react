import { useEffect, useRef } from 'react';

function useIntersectionObserver(onIntersect, isFetching, options = {}) {
  const observerRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const observerCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isFetching) {
        onIntersect();
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, options);
    observerRef.current.observe(triggerRef.current);

    return () => {
      if (observerRef.current && triggerRef.current) {
        observerRef.current.unobserve(triggerRef.current);
      }
    };
  }, [onIntersect, isFetching, options]);

  return triggerRef;
}

export default useIntersectionObserver;