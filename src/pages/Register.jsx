import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../stylesheets/pages/register.css';
import userDefaultProfile from '../assets/user_default_profile.svg';
import { API_BASE_URL } from '../constants/api';

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
  const [nicknameStatus, setNicknameStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const validateEmail = email =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ''
      : '* 유효한 이메일을 입력하세요.';

  const validatePassword = password => {
    const isValidLength = password.length >= 8 && password.length <= 20;
    const hasNumber = /[0-9]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return isValidLength &&
      hasNumber &&
      hasUpperCase &&
      hasLowerCase &&
      hasSpecialChar
      ? ''
      : '* 비밀번호는 8자 이상 20자 이하이며, 특수문자, 영어, 숫자를 각각 하나 이상 포함해야 합니다.';
  };

  const validatePasswordChecker = (password, passwordChecker) =>
    password === passwordChecker ? '' : '* 비밀번호가 일치하지 않습니다.';

  const validateNickname = async nickname => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setNicknameStatus('error');
      setNicknameMessage('* 닉네임을 입력하세요.');
      return;
    }
    if (trimmedNickname.length > 10) {
      setNicknameStatus('error');
      setNicknameMessage('* 닉네임은 10자리 이하여야 합니다.');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/check-nickname?nickname=${trimmedNickname}`,
      );
      const data = await response.json();

      if (data.data.isAvailable) {
        setNicknameStatus('success');
        setNicknameMessage('사용 가능한 닉네임입니다.');
      } else {
        setNicknameStatus('error');
        setNicknameMessage('* 닉네임이 중복되었습니다.');
      }
    } catch {
      setNicknameStatus('error');
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
      passwordChecker: validatePasswordChecker(
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

    if (
      Object.values(errors).some(error => error) ||
      nicknameStatus !== 'success'
    ) {
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
      console.error('회원가입 중 오류 발생:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="register">
      <h1 className="register-logo-str">회원가입</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-box-image">
          <label htmlFor="profileImage">프로필 사진</label>
          <div className="image-placeholder-wrapper">
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
            <div
              className="image-placeholder"
              onClick={() => document.getElementById('profileImage').click()}
            >
              {imagePreview ? (
                <img
                  id="imagePreview"
                  className="image-preview"
                  src={imagePreview}
                  alt="Image Preview"
                />
              ) : (
                <img
                  className="placeholder-plus"
                  src={userDefaultProfile}
                  alt="plus"
                />
              )}
            </div>
          </div>
        </div>

        <div className="input-box">
          <label htmlFor="email">이메일 *</label>
          <input
            type="text"
            name="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleEmailChange}
          />
          <span
            className="help-text"
            style={{ visibility: errors.email ? 'visible' : 'hidden' }}
          >
            {errors.email}
          </span>
        </div>

        <div className="input-box">
          <label htmlFor="password">비밀번호 *</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handlePasswordChange}
          />
          <span
            className="help-text"
            style={{ visibility: errors.password ? 'visible' : 'hidden' }}
          >
            {errors.password}
          </span>
        </div>

        <div className="input-box">
          <label htmlFor="passwordChecker">비밀번호 확인 *</label>
          <input
            type="password"
            name="passwordChecker"
            placeholder="비밀번호를 한 번 더 입력하세요"
            value={formData.passwordChecker}
            onChange={handlePasswordCheckerChange}
          />
          <span
            className="help-text"
            style={{
              visibility: errors.passwordChecker ? 'visible' : 'hidden',
            }}
          >
            {errors.passwordChecker}
          </span>
        </div>

        <div className="input-box">
          <label htmlFor="nickname">닉네임 *</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임을 입력하세요"
            value={formData.nickname}
            onChange={handleNicknameChange}
          />
          <span
            className={`help-text ${nicknameStatus === 'success' ? 'success' : ''}`}
            style={{ visibility: 'visible' }}
          >
            {nicknameMessage}
          </span>
        </div>

        <div className="btn-box">
          <button
            className="register-btn btn-submit"
            type="submit"
            disabled={
              Object.values(errors).some(error => error) ||
              !formData.email ||
              !formData.password ||
              nicknameStatus !== 'success'
            }
          >
            회원가입
          </button>
          <Link className="login-redirect-btn" to="/login">
            로그인 하러가기
          </Link>
        </div>
      </form>
    </div>
  );
}
