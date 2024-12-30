import React from 'react';

const styles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const LoadingUI = ({ isFetching, message }) => {
  return (
    <>
      {isFetching && (
        <div style={styles}>
          <div>{message || '로딩 중...'}</div>
        </div>
      )}
    </>
  );
};

export default LoadingUI;
