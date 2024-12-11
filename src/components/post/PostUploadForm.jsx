import React, { useState } from 'react';

import InputField from '../ui/InputField';
import FileInput from '../ui/FileInput';
import SubmitButton from '../ui/SubmitButton';
import styles from './PostUploadForm.module.css';
import { API_BASE_URL } from '../../constants/api';

const PostUploadForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const validateInputs = () => {
    const isTitleFilled = title.trim() !== '' && title.length <= 26;
    const isContentFilled = content.trim() !== '';
    setIsValid(isTitleFilled && isContentFilled);
  };

  const handleTitleChange = event => {
    setTitle(event.target.value.slice(0, 26));
    validateInputs();
  };

  const handleContentChange = event => {
    setContent(event.target.value);
    validateInputs();
  };

  const handleImageChange = event => {
    setImage(event.target.files[0]);
  };

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

      const responseJson = await response.json();
      return responseJson;
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
        window.location.href = '/';
      } else {
        console.error('업로드 실패:', result.message);
      }
    } catch (error) {
      alert('게시글 업로드 중 오류가 발생했습니다.');
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
        />
        <InputField
          label="내용*"
          name="content"
          value={content}
          onChange={handleContentChange}
          placeholder="내용을 입력해주세요."
          isTextArea
        />
        <span
          className={styles.helperText}
          style={{ display: isValid ? 'none' : 'block' }}
        >
          * 제목과 내용을 입력해 주세요.
        </span>
        <FileInput
          label="이미지"
          name="postImage"
          onChange={handleImageChange}
        />
        <SubmitButton isValid={isValid} label="생성하기" />
      </form>
    </section>
  );
};

export default PostUploadForm;