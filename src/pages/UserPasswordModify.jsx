// React 및 React Hooks
import React, { useState } from 'react';

// React Router 라이브러리
import { useNavigate } from 'react-router-dom';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api.js';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField.jsx';
import SubmitButton from '../components/ui/SubmitButton.jsx';

// 스타일 파일 (CSS Modules)
import styles from './UserPasswordModify.module.css';

const UserPasswordModify = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [newPasswordMessage, setNewPasswordMessage] = useState('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState('');
  const [newPasswordStatus, setNewPasswordStatus] = useState('');
  const [passwordCheckStatus, setPasswordCheckStatus] = useState('');

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

  const validatePasswordCheck = (password, passwordChecker) =>
    password === passwordChecker ? '' : '* 비밀번호가 일치하지 않습니다.';

  const handlePasswordChange = e => {
    const password = e.target.value;
    setNewPassword(password);
    const errorMessage = validatePassword(password);
    setNewPasswordMessage(errorMessage);
    setNewPasswordStatus(errorMessage ? 'error' : 'success');
  };

  const handlePasswordCheckChange = e => {
    const passwordCheck = e.target.value;
    setPasswordCheck(passwordCheck);
    const errorMessage = validatePasswordCheck(newPassword, passwordCheck);
    setPasswordCheckMessage(errorMessage);
    setPasswordCheckStatus(errorMessage ? 'error' : 'success');
  };

  const handleModify = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: btoa(newPassword),
          passwordCheck: btoa(passwordCheck),
        }),
        credentials: 'include',
      });

      if ((await response.json()).code === 2000) {
        alert('비밀번호가 성공적으로 수정되었습니다.');
        navigate('/');
      } else {
        alert('비밀번호 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 수정 중 오류가 발생했습니다:', error);
    }
  };
  return (
    <section className={styles.userPasswordModify}>
      <h1 className={styles.headerStr}>비밀번호 수정</h1>
      <form className={styles.userPasswordModifyForm}>
        <InputField
          label="새 비밀번호"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
          placeholder="새 비밀번호를 입력하세요"
          helperMessage={newPasswordMessage}
        />
        <InputField
          label="새 비밀번호 확인"
          name="passwordCheck"
          type="password"
          value={passwordCheck}
          onChange={handlePasswordCheckChange}
          placeholder="새 비밀번호를 다시 입력하세요"
          helperMessage={passwordCheckMessage}
        />
        <div>
          <SubmitButton
            label={'수정하기'}
            className={styles.modifyButton}
            onClick={handleModify}
            disabled={
              !newPassword ||
              !passwordCheck ||
              newPasswordStatus === 'error' ||
              passwordCheckStatus === 'error'
            }
          >
            수정하기
          </SubmitButton>
        </div>
      </form>
    </section>
  );
};

export default UserPasswordModify;
