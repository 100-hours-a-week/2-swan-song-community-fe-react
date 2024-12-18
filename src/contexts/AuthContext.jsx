// React 및 React Hooks
import { createContext, useContext, useState, useEffect } from 'react';

// React Router 라이브러리
import { useNavigate } from 'react-router-dom';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api.js';

// 프로젝트 내부 에셋 (이미지 파일)
import userDefaultProfile from '../assets/user_default_profile.svg';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(userDefaultProfile);
  const [userId, setUserId] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  const updateAuthState = (status, image = userDefaultProfile) => {
    setIsLoggedIn(status);
    setProfileImage(image);
  };

  const checkSession = async () => {
    setIsCheckingSession(true);
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie =>
      cookie.trim().startsWith('session_id='),
    );
    const sessionId = sessionCookie ? sessionCookie.split('=')[1] : null;

    if (!sessionId) {
      updateAuthState(false);
      navigate('/login');
      setIsCheckingSession(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/isLoggedIn`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${sessionId}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        updateAuthState(
          data.data.isLoggedIn,
          data.profileImageUrl || userDefaultProfile,
        );
      } else {
        updateAuthState(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('세션 확인 중 오류:', error);
      updateAuthState(false);
      navigate('/login');
    } finally {
      setIsCheckingSession(false);
    }
  };

  const fetchUserId = async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    if (data.code === 2000) {
      setUserId(parseInt(data.data.userId));
    }
  };

  useEffect(() => {
    checkSession();
    fetchUserId();
  }, []);

  if (isCheckingSession) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, profileImage, updateAuthState, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
