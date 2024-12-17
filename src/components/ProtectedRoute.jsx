// React Router 라이브러리
import { Navigate } from 'react-router-dom';

// 전역 상태 및 컨텍스트
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const localIsLoggedIn = localStorage.getItem(isLoggedIn);

  if (!isLoggedIn && !localIsLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
