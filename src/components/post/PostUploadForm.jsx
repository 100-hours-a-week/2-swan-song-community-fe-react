// React 및 React Router 라이브러리
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 전역 상태 및 컨텍스트
import { usePostContext } from '../../contexts/PostContext.jsx';

// 상수 및 환경 변수
import { API_BASE_URL } from '../../constants/api';

// 프로젝트 내부 컴포넌트
import InputField from '../ui/InputField';
import FileInput from '../ui/FileInput';
import SubmitButton from '../ui/SubmitButton';
import HelperText from '../ui/HelperText';

// 스타일 파일 (CSS Modules)
import styles from './PostUploadForm.module.css';

const PostUploadForm = () => {
  const { posts, setPosts } = usePostContext();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const navigate = useNavigate();

  const handleTitleChange = event => {
    setTitle(event.target.value.slice(0, 26));
  };

  const handleContentChange = event => {
    setContent(event.target.value);
  };

  const handleImageChange = event => {
    setImage(event.target.files[0]);
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
        setPosts([result.data, ...posts]);
        navigate('/');
      } else {
        console.error('업로드 실패:', result.message);
      }
    } catch (error) {
      alert('게시글 업로드 중 오류가 발생했습니다.');
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
        <SubmitButton
          isValid={isValid}
          label="생성하기"
          className={styles.postUploadBtn}
        />
      </form>
    </section>
  );
};

export default PostUploadForm;
