// React 및 React Hooks
import React, { useEffect, useState } from 'react';

// React Router 라이브러리
import { useNavigate } from 'react-router-dom';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api.js';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField.jsx';
import SubmitButton from '../components/ui/SubmitButton.jsx';
import WithAuthenticated from '../components/HOC/WithAuthenticated.jsx';

// 프로젝트 내부 util 함수
import {
  validateCurrentAndNewPassword,
  validatePassword,
  validatePasswordCheck,
} from '../utils/authValidator.js';

// 스타일 파일 (CSS Modules)
import styles from './UserPasswordModify.module.css';

const UserPasswordModify = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [currentPasswordMessage, setCurrentPasswordMessage] = useState('');
  const [newPasswordMessage, setNewPasswordMessage] = useState('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState('');
  const [currentPasswordStatus, setCurrentPasswordStatus] = useState(false);
  const [newPasswordStatus, setNewPasswordStatus] = useState(false);
  const [passwordCheckStatus, setPasswordCheckStatus] = useState(false);
  const [isNewPasswordTouching, setIsNewPasswordTouching] = useState(false);
  const [isPasswordCheckerTouching, setIsPasswordCheckerTouching] =
    useState(false);

  useEffect(() => {
    if (isNewPasswordTouching) {
      const errorMessage = validateCurrentAndNewPassword(
        currentPassword,
        newPassword,
      );
      setNewPasswordMessage(errorMessage);
      setNewPasswordStatus(errorMessage === '');
    }
  }, [currentPassword, isNewPasswordTouching]);

  useEffect(() => {
    if (isPasswordCheckerTouching) {
      const errorMessage = validatePasswordCheck(newPassword, passwordCheck);
      setPasswordCheckMessage(errorMessage);
      setPasswordCheckStatus(errorMessage === '');
    }
  }, [newPassword, isPasswordCheckerTouching]);

  const handleCurrentPasswordChange = e => {
    const password = e.target.value;
    setCurrentPassword(password);
    const errorMessage = validatePassword(password);
    setCurrentPasswordMessage(errorMessage);
    setCurrentPasswordStatus(errorMessage === '');
    setIsNewPasswordTouching(true);
  };

  const handleNewPasswordChange = e => {
    const password = e.target.value;
    setNewPassword(password);
    const errorMessage =
      validatePassword(password) ||
      validateCurrentAndNewPassword(currentPassword, password);
    setNewPasswordMessage(errorMessage);
    setNewPasswordStatus(errorMessage === '');
  };

  const handlePasswordCheckChange = e => {
    const passwordCheck = e.target.value;
    setPasswordCheck(passwordCheck);
    const errorMessage = validatePasswordCheck(newPassword, passwordCheck);
    setPasswordCheckMessage(errorMessage);
    setPasswordCheckStatus(errorMessage === '');
    setIsPasswordCheckerTouching(true);
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
          currentPassword: btoa(currentPassword),
          newPassword: btoa(newPassword),
          passwordCheck: btoa(passwordCheck),
        }),
        credentials: 'include',
      });

      const jsonData = await response.json();
      if (jsonData.code === 2000) {
        alert('비밀번호가 성공적으로 수정되었습니다.');
        navigate('/');
      } else if (jsonData.code === 4000 || jsonData.code === 4003) {
        alert(jsonData.message);
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
          label="현재 비밀번호"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          placeholder="현재 비밀번호를 입력하세요"
          isError={!currentPasswordStatus}
          helperMessage={currentPasswordMessage}
        />
        <div style={{ border: '0.6px solid #2e507760', borderRadius: '4px' }} />
        <InputField
          label="새 비밀번호"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          placeholder="새 비밀번호를 입력하세요"
          isError={!newPasswordStatus}
          helperMessage={newPasswordMessage}
        />
        <InputField
          label="새 비밀번호 확인"
          name="passwordCheck"
          type="password"
          value={passwordCheck}
          onChange={handlePasswordCheckChange}
          placeholder="새 비밀번호를 다시 입력하세요"
          isError={!passwordCheckStatus}
          helperMessage={passwordCheckMessage}
        />
        <div>
          <SubmitButton
            label={'수정하기'}
            className={styles.modifyButton}
            onClick={handleModify}
            isValid={newPasswordStatus && passwordCheckStatus}
          >
            수정하기
          </SubmitButton>
        </div>
      </form>
    </section>
  );
};

export default WithAuthenticated(UserPasswordModify);
