import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import InputField from '../components/ui/InputField';
import SubmitButton from '../components/ui/SubmitButton';
import { API_BASE_URL, IMAGE_BASE_URL } from '../constants/api.js';
import { useAuth } from '../contexts/AuthContext';
import userDefaultProfile from '../assets/user_default_profile.svg';
import styles from './Login.module.css';
import HelperText from '../components/ui/HelperText';

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
        sessionStorage.setItem('user_id', result.data.userId);
        const profileUrl = result.data.profileImageUrl
          ? `${IMAGE_BASE_URL}${result.data.profileImageUrl}`
          : userDefaultProfile;
        updateAuthState(true, profileUrl);
        navigate('/');
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
            errorClassName={styles.loginErrorHelper}
            error={'* 아이디나 비밀번호가 형식에 맞지 않습니다.'}
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
