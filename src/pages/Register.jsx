// React 및 React Hooks
import { useState } from 'react';

// React Router 라이브러리
import { useNavigate, Link } from 'react-router-dom';

// 외부 라이브러리
import classNames from 'classnames';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField';
import SubmitButton from '../components/ui/SubmitButton';
import ProfileImageInput from '../components/ui/ProfileImageInput';

// 프로젝트 내부 util 함수
import {
  validateEmail,
  validatePassword,
  validatePasswordCheck,
} from '../utils/authValidator.js';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api';

// 스타일 파일 (CSS Modules)
import styles from './Register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordChecker: '',
    nickname: '',
    profileImage: null,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordChecker: '',
    nickname: '',
  });
  const [nicknameMessage, setNicknameMessage] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const validateNickname = async nickname => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameStatus(false);
      setNicknameMessage('* 닉네임을 입력하세요.');
      return;
    }
    if (trimmedNickname.length > 10) {
      setNicknameStatus(false);
      setNicknameMessage('* 닉네임은 10자리 이하여야 합니다.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/check-nickname?nickname=${trimmedNickname}`,
      );
      const data = await response.json();

      if (data.data.isAvailable) {
        setNicknameStatus(true);
        setNicknameMessage('사용 가능한 닉네임입니다.');
      } else {
        setNicknameStatus(false);
        setNicknameMessage('* 닉네임이 중복되었습니다.');
      }
    } catch {
      setNicknameStatus(false);
      setNicknameMessage('* 닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  const handleEmailChange = e => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));
    setErrors(prev => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordChange = e => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    setErrors(prev => ({ ...prev, password: validatePassword(password) }));
  };

  const handlePasswordCheckerChange = e => {
    const passwordChecker = e.target.value;
    setFormData(prev => ({ ...prev, passwordChecker }));
    setErrors(prev => ({
      ...prev,
      passwordChecker: validatePasswordCheck(
        formData.password,
        passwordChecker,
      ),
    }));
  };

  const handleNicknameChange = e => {
    const nickname = e.target.value;
    setFormData(prev => ({ ...prev, nickname }));
    validateNickname(nickname);
  };

  const handleProfileImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (Object.values(errors).some(error => error) || !nicknameStatus) {
      alert('모든 필드를 정확히 입력해주세요.');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('email', formData.email);
    submitFormData.append('password', btoa(formData.password));
    submitFormData.append('passwordChecker', btoa(formData.passwordChecker));
    submitFormData.append('nickname', formData.nickname.trim());
    if (formData.profileImage) {
      submitFormData.append('profileImage', formData.profileImage);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        body: submitFormData,
      });
      const result = await response.json();

      if (result.code === 2001) {
        navigate('/login');
      } else {
        alert(result.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다.');
      console.error('회원가입 중 오류 발생:', error);
    }
  };

  return (
    <div className={styles.register}>
      <h1 className={styles.registerLogoStr}>회원가입</h1>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <ProfileImageInput
          label="프로필 사진"
          name="profileImage"
          onChange={handleProfileImageChange}
          preview={imagePreview}
        />
        <InputField
          label="이메일 *"
          name="email"
          value={formData.email}
          onChange={handleEmailChange}
          placeholder="이메일을 입력하세요"
          isError={errors.email}
          helperMessage={errors.email}
        />
        <InputField
          label="비밀번호 *"
          name="password"
          type="password"
          value={formData.password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력하세요"
          isError={errors.password}
          helperMessage={errors.password}
        />
        <InputField
          label="비밀번호 확인 *"
          name="passwordChecker"
          type="password"
          value={formData.passwordChecker}
          onChange={handlePasswordCheckerChange}
          placeholder="비밀번호를 한 번 더 입력하세요"
          isError={errors.passwordChecker}
          helperMessage={errors.passwordChecker}
        />
        <InputField
          label="닉네임 *"
          name="nickname"
          value={formData.nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임을 입력하세요"
          helperMessage={nicknameMessage}
          isError={!nicknameStatus}
        />
        <div className={styles.btnBox}>
          <SubmitButton
            isValid={
              !Object.values(errors).some(error => error) &&
              formData.email &&
              formData.password &&
              nicknameStatus
            }
            label="회원가입"
            className={classNames(styles.btnSubmit, styles.registerBtn)}
          />
          <Link className={styles.loginRedirectBtn} to="/login">
            로그인 하러가기
          </Link>
        </div>
      </form>
    </div>
  );
}
