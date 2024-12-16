import React, { useEffect, useState, useReducer, useRef } from 'react';
import { usePostContext } from '../contexts/PostContext.jsx';
import { useNavigate } from 'react-router-dom';
import closeIcon from '../assets/close_square_light.svg';
import userDefaultProfile from '../assets/user_default_profile.svg';
import Cookies from 'js-cookie';
import { API_BASE_URL, IMAGE_BASE_URL } from '../constants/api.js';
import styles from './UserInfoModify.module.css';
import Button from '../components/ui/Button.jsx';
import InputField from '../components/ui/InputField.jsx';
import SubmitButton from '../components/ui/SubmitButton.jsx';

const initialState = {
  profileImageUrl: null,
  isChanged: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        profileImageUrl: action.payload,
        isChanged: false,
      };
    case 'SET_DEFAULT_PROFILE':
      return {
        ...state,
        profileImageUrl: userDefaultProfile,
        isChanged: true,
      };
    case 'SET_PROFILE_IMAGE':
      return {
        ...state,
        profileImageUrl: action.payload,
        isChanged: true,
      };
  }
};

const UserInfoModify = () => {
  const { adjustUpdatingUser } = usePostContext();
  const hasAlreadyProfileImage = useRef(false);
  const profileImageInput = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');
  const navigate = useNavigate();
  const originalNickname = useRef('');

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
            if (data.data.profileImageUrl) {
              hasAlreadyProfileImage.current = true;
            }
            const profileUrl = data.data.profileImageUrl
              ? `${IMAGE_BASE_URL}${data.data.profileImageUrl}`
              : userDefaultProfile;
            dispatch({ type: 'INITIALIZE', payload: profileUrl });
            setEmail(data.data.email);
            setNickname(data.data.nickname);
            originalNickname.current = data.data.nickname;
          }
        } catch (error) {
          console.error('프로필을 불러오는데 실패했습니다:', error);
        }
      };

      getProfile();
    }
  }, []);

  const validateNickname = async nickname => {
    const trimmedNickname = nickname.trim();

    if (trimmedNickname === originalNickname.current) {
      // Ref와 비교
      setNicknameStatus('success');
      setNicknameMessage('');
      return;
    }

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

  useEffect(() => {
    validateNickname(nickname);
  }, [nickname]);

  // 파일 선택 이벤트 핸들러
  const handleFileChange = () => {
    const file = profileImageInput.current.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      dispatch({ type: 'SET_PROFILE_IMAGE', payload: objectUrl });

      // 메모리 누수를 방지하기 위해 URL 해제
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleModify = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append(
      'isProfileImageRemoved',
      hasAlreadyProfileImage.current && state.isChanged,
    );
    if (state.isChanged) {
      formData.append('profileImage', profileImageInput.current.files[0]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (data.code === 2000) {
        alert('회원정보가 수정되었습니다.');
        adjustUpdatingUser(data.data);
        navigate('/');
      } else {
        alert('회원정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원정보 수정 중 오류가 발생했습니다:', error);
    }
  };

  const handleWithdrawal = async () => {
    const confirmWithdrawal = window.confirm('정말로 탈퇴하시겠습니까?');
    if (!confirmWithdrawal) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const res = await response;

      if (res.status === 204) {
        alert('회원 탈퇴가 완료되었습니다.');
        Cookies.remove('session_id');
        navigate('/login');
      } else {
        alert('회원 탈퇴에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <section className={styles.userInfoModify}>
      <h1 className={styles.headerStr}>회원정보수정</h1>
      <form className={styles.userInfoModifyForm}>
        <label htmlFor="profileImage" className={styles.imagePlaceholderLabel}>
          프로필 사진
        </label>
        <div className={styles.imagePlaceholderContainer}>
          <div className={styles.imagePlaceholderWrapper}>
            <img
              src={state.profileImageUrl}
              className={styles.imagePlaceholder}
              onClick={() => profileImageInput.current.click()}
            />

            {state.profileImageUrl !== userDefaultProfile ? (
              <Button
                className={styles.removeImageBtn}
                onClick={() => dispatch({ type: 'SET_DEFAULT_PROFILE' })}
              >
                <img src={closeIcon} alt="Remove" />
              </Button>
            ) : null}
            <input
              name="profileImage"
              type={'file'}
              ref={profileImageInput}
              hidden
              onChange={handleFileChange}
            ></input>
          </div>
        </div>
        <InputField
          label="이메일"
          name="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          initialvalue={email}
          className={styles.inputReadOnly}
          readOnly
        />
        <InputField
          label="닉네임"
          name="nickname"
          value={nickname}
          onChange={event => setNickname(event.target.value)}
          placeholder="닉네임을 입력하세요"
          initialvalue={nickname}
          error={nicknameMessage}
          errorClassName={nicknameStatus === 'success'}
        />
        <div className={styles.buttonBox}>
          <SubmitButton
            label={'수정하기'}
            className={styles.modifyButton}
            onClick={handleModify}
            disabled={
              !nickname || nicknameStatus !== 'success' || !state.isChanged
            }
          >
            수정하기
          </SubmitButton>
          <SubmitButton
            label={'회원탈퇴'}
            className={styles.withdrawalButton}
            onClick={handleWithdrawal}
          ></SubmitButton>
        </div>
      </form>
    </section>
  );
};

export default UserInfoModify;