import { API_BASE_URL, IMAGE_BASE_URL } from '../constants/api.js';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import shevlonLeft from '../assets/shevlon_left.svg';
import userDefaultProfile from '../assets/user_default_profile.svg';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Header({ backUrl, containProfileDropdown }) {
  const { profileImage, updateAuthState } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // 메뉴 열림/닫힘 상태

  useEffect(() => {
    const sessionId = Cookies.get('session_id');

    if (sessionId) {
      const getProfile = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: 'GET',
            credentials: 'include',
          });

          const data = await response.json();

          if (data.code === 2000) {
            const profileUrl = data.data.profileImageUrl
              ? `${IMAGE_BASE_URL}${data.data.profileImageUrl}`
              : userDefaultProfile;

            updateAuthState(true, profileUrl);
          }
        } catch (error) {
          console.error('프로필을 불러오는데 실패했습니다:', error);
        }
      };

      getProfile();
    }
  }, [updateAuthState]);

  const logoutUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.status === 204) {
        Cookies.remove('session_id');
        updateAuthState(false, userDefaultProfile); // 로그아웃 시 상태 초기화
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('로그아웃에 실패했습니다:', error);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prevState => !prevState);
  };

  return (
    <header className="global-navbar">
      <div className="global-navbar-content">
        {backUrl && (
          <Link to={backUrl}>
            <img className="back" src={shevlonLeft} alt="뒤로가기" />
          </Link>
        )}
        <h1>아무 말 대잔치</h1>
        {containProfileDropdown && (
          <div className="profile-dropdown">
            <img
              id="profileDropDownToggle"
              className="profile-image"
              src={profileImage}
              alt="프로필 이미지"
              onClick={toggleProfileMenu}
            />
            {isProfileMenuOpen && (
              <ul className="profile-menu">
                <li>
                  <a href="./views/user-info-modify.html">회원정보수정</a>
                </li>
                <li>
                  <a href="./views/user-password-modify.html">비밀번호수정</a>
                </li>
                <li>
                  <button onClick={logoutUser}>로그아웃</button>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
