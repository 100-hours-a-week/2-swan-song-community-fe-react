// React 및 React Hooks
import React, { useEffect, useState, useReducer, useRef } from 'react';

// React Router 라이브러리
import { useNavigate } from 'react-router-dom';

// 외부 라이브러리
import Cookies from 'js-cookie';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api.js';

// 프로젝트 내부 에셋 (이미지 파일)
import closeIcon from '../assets/close_square_light.svg';
import userDefaultProfile from '../assets/user_default_profile.svg';

// 프로젝트 내부 컴포넌트
import Button from '../components/ui/Button.jsx';
import InputField from '../components/ui/InputField.jsx';
import SubmitButton from '../components/ui/SubmitButton.jsx';
import RemoveModal from '../components/ui/RemoveModal.jsx';
import WithAuthenticated from '../components/HOC/WithAuthenticated.jsx';
import LoadingUI from '../components/LoadingUI.jsx';

// 커스텀 훅
import useFetch from '../hooks/useFetch.js';

// 스타일 파일 (CSS Modules)
import styles from './UserInfoModify.module.css';
import { useQueryClient } from '@tanstack/react-query';

const initialState = {
  profileImageUrl: null,
  isImageChanged: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        profileImageUrl: action.payload,
        isImageChanged: false,
      };
    case 'SET_DEFAULT_PROFILE':
      return {
        ...state,
        profileImageUrl: userDefaultProfile,
        isImageChanged: true,
      };
    case 'SET_PROFILE_IMAGE':
      return {
        ...state,
        profileImageUrl: action.payload,
        isImageChanged: true,
      };
  }
};

const UserInfoModify = () => {
  const hasAlreadyProfileImage = useRef(false);
  const profileImageInput = useRef(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState(null);
  const [nicknameStatus, setNicknameStatus] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState('');
  const navigate = useNavigate();
  const originalNickname = useRef('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isFetching, fetchData } = useFetch();

  useEffect(() => {
    const sessionId = Cookies.get('session_id');

    if (sessionId) {
      const getProfile = async () => {
        try {
          const data = await fetchData(`${API_BASE_URL}/users/me`);

          if (data.code === 2000) {
            if (data.data.profileImageUrl) {
              hasAlreadyProfileImage.current = true;
            }
            const profileUrl = data.data.profileImageUrl
              ? data.data.profileImageUrl
              : userDefaultProfile;
            dispatch({ type: 'INITIALIZE', payload: profileUrl });
            setEmail(data.data.email);
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
      setNicknameStatus(true);
      setNicknameMessage('');
      return;
    }

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

  useEffect(() => {
    validateNickname(nickname);
  }, [nickname]);

  // 파일 선택 이벤트 핸들러
  const handleFileChange = event => {
    const file = profileImageInput.current.files[0];

    if (file) {
      // 파일 MIME 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('유효한 이미지가 아닙니다.');
        event.target.value = ''; // 입력 값 초기화
        return;
      }

      // 파일 크기 검증
      if (file.size > 1024 * 1024 * 5) {
        alert('이미지는 5MB 이하로 업로드 가능합니다.');
        event.target.value = ''; // 입력 값 초기화
        return;
      }
    }

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
    if (nickname && nickname !== originalNickname.current) {
      formData.append('nickname', nickname);
    }
    formData.append(
      'isProfileImageRemoved',
      hasAlreadyProfileImage.current && state.isImageChanged,
    );
    if (state.isImageChanged) {
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
        navigate('/');
      } else {
        alert(data.message || '회원정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원정보 수정 중 오류가 발생했습니다:', error);
    }
  };

  const handleWithdrawal = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/withdrawal`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const res = await response.json();

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

  if (isFetching) {
    return <LoadingUI isFetching={isFetching} />;
  }

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
              accept={'image/*'}
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
          onChange={event => setNickname(event.target.value)}
          placeholder={originalNickname.current}
          helperMessage={nicknameMessage}
          isError={!nicknameStatus}
        />
        <div>
          <SubmitButton
            label={'수정하기'}
            className={styles.modifyButton}
            onClick={handleModify}
            isValid={
              (nicknameStatus && originalNickname.current !== nickname) ||
              state.isImageChanged
            }
          >
            수정하기
          </SubmitButton>
          <Button
            label={'회원탈퇴'}
            className={styles.withdrawalButton}
            onClick={() => setIsModalOpen(true)}
          ></Button>
        </div>
      </form>
      <RemoveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleWithdrawal}
        message={'정말로 탈퇴하시겠습니까?'}
      />
    </section>
  );
};

export default WithAuthenticated(UserInfoModify);
