// React 및 React Router 라이브러리
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField';
import FileInput from '../components/ui/FileInput';
import SubmitButton from '../components/ui/SubmitButton';
import HelperText from '../components/ui/HelperText';
import WithAuthenticated from '../components/HOC/WithAuthenticated.jsx';

// 스타일 파일 (CSS Modules)
import styles from './PostUpload.module.css';
import { useQueryClient } from '@tanstack/react-query';

const PostUpload = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleTitleChange = event => {
    setTitle(event.target.value.slice(0, 26));
  };

  const handleContentChange = event => {
    const content = event.target.value;
    if (content.length > 1000) {
      alert('게시글은 1000자 이하로 작성해주세요.');
      return;
    }
    setContent(content);
  };

  const handleImageChange = event => {
    const file = event.target.files[0];

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

    setImage(file);
  };

  useEffect(() => {
    const isTitleFilled = title.trim() !== '' && title.length <= 26;
    const isContentFilled = content.trim() !== '';
    setIsValid(isTitleFilled && isContentFilled);
  }, [title, content]);

  const uploadPost = async formData => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || '업로드 실패');
        throw new Error(errorData.message || '업로드 실패');
      }

      return await response.json();
    } catch (error) {
      console.error('업로드 중 오류 발생:', error.message);
      throw error;
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!isValid) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('postImage', image);
    }

    try {
      const result = await uploadPost(formData);

      if (result.code === 2001) {
        navigate('/');
      } else {
        alert(result.message || '게시글 업로드에 실패했습니다.');
        console.error('업로드 실패:', result.message);
      }
    } catch (error) {
      alert(error.message || '게시글 업로드 중 오류가 발생했습니다.');
      console.error('게시글 업로드 중 오류:', error);
    }
  };

  return (
    <section className={styles.postUpload}>
      <div className={styles.postUploadHeader}>
        <a>게시글 작성</a>
      </div>
      <form
        id="postUploadForm"
        className={styles.postUploadForm}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <InputField
          label="제목*"
          name="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요. (최대 26글자)"
          className={{
            inputBox: styles.inputBox,
            inputBoxLabel: styles.inputBoxLabel,
            inputBoxInput: styles.inputBoxInput,
          }}
        />
        <InputField
          label="내용*"
          name="content"
          value={content}
          onChange={handleContentChange}
          placeholder="내용을 입력해주세요."
          isTextArea
          className={{
            inputBox: styles.inputBox,
            inputBoxLabel: styles.inputBoxLabel,
            inputBoxInput: styles.inputBoxInput,
            textArea: styles.inputBoxTextarea,
          }}
        />
        {!isValid && (
          <HelperText helperMessage={'* 제목과 내용을 입력해 주세요.'} />
        )}
        <FileInput
          label="이미지"
          name="postImage"
          onChange={handleImageChange}
        />
        <div className={styles.btnBox}>
          <SubmitButton
            isValid={isValid}
            label="생성하기"
            className={styles.postUploadBtn}
          />
        </div>
      </form>
    </section>
  );
};

export default WithAuthenticated(PostUpload);
