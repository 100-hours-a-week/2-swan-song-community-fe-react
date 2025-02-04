// React 및 React Hooks
import { useRef, useState } from 'react';

// React Router 라이브러리
import { useNavigate, Link } from 'react-router-dom';

// 외부 라이브러리
import classNames from 'classnames';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField';
import SubmitButton from '../components/ui/SubmitButton';
import ProfileImageInput from '../components/ui/ProfileImageInput';


import  axios  from 'axios';

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
  const nicknameRef = useRef(null);

  const validateNickname = async nickname => {
    const trimmedNickname = nickname?.trim() || '';

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
      const currentNicknameVal = nicknameRef.current.value; // state 반영 타이밍과 input 태그 반영 타이밍이 달라 예외처리

      if (data.data.isAvailable) {
        if (currentNicknameVal === '') {
          setNicknameStatus(false);
          setNicknameMessage('* 닉네임을 입력하세요.');
        } else if (currentNicknameVal.length > 10) {
          setNicknameStatus(false);
          setNicknameMessage('* 닉네임은 10자리 이하여야 합니다.');
        } else {
          setNicknameStatus(true);
          setNicknameMessage('사용 가능한 닉네임입니다.');
        }
      } else {
        if (currentNicknameVal === '') {
          setNicknameStatus(false);
          setNicknameMessage('* 닉네임을 입력하세요.');
        } else if (currentNicknameVal.length > 10) {
          setNicknameStatus(false);
          setNicknameMessage('* 닉네임은 10자리 이하여야 합니다.');
        } else {
          setNicknameStatus(false);
          setNicknameMessage(`* ${data.message || '닉네임이 중복되었습니다.'}`);
        }
      }
    } catch {
      setNicknameStatus(false);
      setNicknameMessage('* 닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };


  const checkAvailableEmail = async email => {

    const response = (await axios.get(`${API_BASE_URL}/auth/check-email?email=${email}`)).data;

    if (response.data.isAvailable) {
      return '';
    } else {
      return '* 이미 가입된 이메일입니다.';
    }
  }

  const handleEmailChange = async e => {
    const email = e.target.value;
    setFormData(prev => ({ ...prev, email }));

    const availableFormat = validateEmail(email);
    if (availableFormat) {
      setErrors(prev => ({ ...prev, email: availableFormat }));
      return;
    }

    try {
      const availableDuplication = await checkAvailableEmail(email);
      setErrors(prev => ({ ...prev, email: availableDuplication || '' }));
    } catch (error) {
      console.error('이메일 중복 확인 중 오류 발생:', error);
    }
  };

  const handlePasswordChange = e => {
    const password = e.target.value;
    setFormData(prev => ({ ...prev, password }));
    setErrors(prev => ({ ...prev, password: validatePassword(password) }));

    if (formData.passwordChecker) {
      setErrors(prev => ({
        ...prev,
        passwordChecker: validatePasswordCheck(
          password,
          formData.passwordChecker,
        ),
      }));
    }
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
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // 파일 MIME 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('유효한 이미지가 아닙니다.');
        e.target.value = ''; // 입력 값 초기화
        return;
      }

      // 파일 크기 검증
      if (file.size > 1024 * 1024 * 5) {
        alert('이미지는 5MB 이하로 업로드 가능합니다.');
        e.target.value = ''; // 입력 값 초기화
        return;
      }

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
      alert(error.message || '회원가입 중 오류가 발생했습니다.');
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
          onClickDeleteBtn={() => {
            setImagePreview(null);
            setFormData(prev => ({ ...prev, profileImage: null }));
          }}
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
          ref={nicknameRef}
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
