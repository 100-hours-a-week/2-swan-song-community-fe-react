// React 및 React Hooks
import { useState } from 'react';

// React Router 라이브러리
import { useNavigate, Link } from 'react-router-dom';

// 외부 라이브러리
import classNames from 'classnames';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField';
import SubmitButton from '../components/ui/SubmitButton';
import HelperText from '../components/ui/HelperText';

// 상수 및 환경 변수
import { API_BASE_URL, IMAGE_BASE_URL } from '../constants/api.js';

// 전역 상태 및 컨텍스트
import { useAuth } from '../contexts/AuthContext';

// 프로젝트 내부 에셋 (이미지 파일)
import userDefaultProfile from '../assets/user_default_profile.svg';

// 스타일 파일 (CSS Modules)
import styles from './Login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { updateAuthState } = useAuth();
  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length >= 8;
  const isValid = isEmailValid && isPasswordValid;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!isValid) {
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', btoa(formData.password)); // Base64 인코딩

      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.code === 2000) {
        const profileUrl = result.data.profileImageUrl
          ? `${IMAGE_BASE_URL}${result.data.profileImageUrl}`
          : userDefaultProfile;
        updateAuthState(true, profileUrl);
        navigate('/');
      } else {
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 중 오류:', error);
    }
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.loginLogoStr}>로그인</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <InputField
          label="이메일"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="이메일을 입력하세요"
        />
        <InputField
          label="비밀번호"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="비밀번호를 입력하세요"
        />
        {!isValid && (
          <HelperText
            helperMessage={'* 아이디나 비밀번호가 형식에 맞지 않습니다.'}
          />
        )}
        <div className={styles.btnBox}>
          <SubmitButton
            isValid={isValid}
            label="로그인"
            className={classNames(styles.loginBtn, {
              [styles.loginBtnEnabled]: isValid,
            })}
          />
          <Link className={styles.registerLinkBtn} to="/register">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}
