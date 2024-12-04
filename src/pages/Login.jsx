import { API_BASE_URL, IMAGE_BASE_URL } from '../constants/api.js';
import userDefaultProfile from '../assets/user_default_profile.svg';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import '../stylesheets/pages/login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { updateAuthState } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isValid = isEmailValid && isPasswordValid;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setErrorMessage('* 아이디나 비밀번호가 형식에 맞지 않습니다.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', btoa(password)); // Base64 인코딩

      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.code === 2000) {
        sessionStorage.setItem('user_id', result.data.userId);
        const profileUrl = result.data.profileImageUrl
          ? `${IMAGE_BASE_URL}${result.data.profileImageUrl}`
          : userDefaultProfile;
        updateAuthState(true, profileUrl);
        navigate('/');
      } else {
        setErrorMessage(`* 로그인 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('로그인 중 오류:', error);
      setErrorMessage('* 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div id="loginRootContainer">
      <div className="login">
        <h1 className="login-logo-str">로그인</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-box">
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              name="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-box">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={handleInputChange}
              required
            />
            <span className={`help-text ${!isValid ? 'visible' : ''}`}>
              * 아이디나 비밀번호가 형식에 맞지 않습니다.
            </span>
          </div>
          <div className="btn-box">
            <button
              className={`login-btn ${isValid ? '' : 'disabled'}`}
              type="submit"
              disabled={!isValid}
            >
              로그인
            </button>
            <a className="register-btn" href="/register">
              회원가입
            </a>
          </div>
          {errorMessage && (
            <div className="login-error-helper" style={{ color: 'red' }}>
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
