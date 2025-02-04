// React 및 React Hooks
import { useEffect, useState } from 'react';

// React Router 라이브러리
import { useNavigate, Link } from 'react-router-dom';

// 외부 라이브러리
import classNames from 'classnames';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField';
import SubmitButton from '../components/ui/SubmitButton';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api.js';

// 전역 상태 및 컨텍스트
import { useAuth } from '../contexts/AuthContext';

// 프로젝트 내부 에셋 (이미지 파일)
import userDefaultProfile from '../assets/user_default_profile.svg';
// 프로젝트 내부 util 함수
import { validateEmail, validatePassword } from '../utils/authValidator.js';

// 스타일 파일 (CSS Modules)
import styles from './Login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [emailHelperMessage, setEmailHelperMessage] = useState('');
  const [passwordHelperMessage, setPasswordHelperMessage] = useState('');

  const { updateAuthState, resetAuthState } = useAuth();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState(true);
  const [passwordError, setPasswordError] = useState(true);

  const emailValidator = () => {
    const validResult = validateEmail(formData.email);
    setEmailHelperMessage(validResult);
    setEmailError(validResult !== '');
  };

  const passwordValidator = () => {
    const validResult = validatePassword(formData.password);
    setPasswordHelperMessage(validResult);
    setPasswordError(validResult !== '');
  };

  useEffect(() => {
    emailValidator();
    passwordValidator();
  }, [formData.email, formData.password]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (emailError || passwordError) {
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
        resetAuthState();
        const profileUrl = result.data.profileImageUrl
          ? result.data.profileImageUrl
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
          isError={emailError}
          helperMessage={emailHelperMessage}
        />
        <InputField
          label="비밀번호"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="비밀번호를 입력하세요"
          isError={passwordError}
          helperMessage={passwordHelperMessage}
        />
        <div className={styles.btnBox}>
          <SubmitButton
            isValid={!emailError && !passwordError}
            label="로그인"
            className={classNames(styles.loginBtn, {
              [styles.loginBtnEnabled]: !emailError && !passwordError,
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
