import { API_BASE_URL } from '../constants/api.js';
import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useState, useEffect } from 'react';
import userDefaultProfile from '../assets/user_default_profile.svg';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(userDefaultProfile);
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

  useEffect(() => {
    checkSession();
  }, []);

  if (isCheckingSession) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, profileImage, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
