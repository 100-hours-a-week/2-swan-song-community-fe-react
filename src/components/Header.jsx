// React 및 React Router 라이브러리
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 외부 라이브러리
import Cookies from 'js-cookie';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api.js';

// 프로젝트 내부 에셋 (이미지 파일)
import shevlonLeft from '../assets/shevlon_left.svg';
import userDefaultProfile from '../assets/user_default_profile.svg';

// 전역 상태 및 컨텍스트
import { useAuth } from '../contexts/AuthContext.jsx';

// 스타일 파일 (CSS Modules)
import styles from './Header.module.css';

export default function Header({ backUrl, containProfileDropdown }) {
  const { profileImage, updateAuthState } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
              ? data.data.profileImageUrl
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
        updateAuthState(false, userDefaultProfile);
        navigate('/login');
      }
    } catch (error) {
      console.error('로그아웃에 실패했습니다:', error);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prevState => !prevState);
  };

  function handleMenuBackground() {
    setIsProfileMenuOpen(false);
  }

  return (
    <header className={styles.globalNavbar}>
      <div className={styles.globalNavbarContent}>
        {backUrl && (
          <div className={styles.back}>
            <Link to={backUrl}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.backImg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F6F4F0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="뒤로가기"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
          </div>
        )}
        <h1 className={styles.headerTitle}>COM</h1>
        <h1 className={styles.headerTitle}>munity</h1>
        {containProfileDropdown && (
          <div className={styles.profileDropdown}>
            <img
              id="profileDropDownToggle"
              className={styles.profileImage}
              src={profileImage}
              alt="프로필 이미지"
              onClick={toggleProfileMenu}
            />
            {isProfileMenuOpen && (
              <>
                <div
                  className={styles.menuBackground}
                  onClick={handleMenuBackground}
                ></div>
                <ul className={styles.profileMenu}>
                  <li className={styles.profileMenuItem}>
                    <Link to="/user-info-modify" onClick={toggleProfileMenu}>
                      회원정보수정
                    </Link>
                  </li>
                  <li className={styles.profileMenuItem}>
                    <Link
                      to="/user-password-modify"
                      onClick={toggleProfileMenu}
                    >
                      비밀번호수정
                    </Link>
                  </li>
                  <li className={styles.profileMenuItem}>
                    <a
                      onClick={() => {
                        toggleProfileMenu();
                        logoutUser();
                      }}
                    >
                      로그아웃
                    </a>
                  </li>
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
