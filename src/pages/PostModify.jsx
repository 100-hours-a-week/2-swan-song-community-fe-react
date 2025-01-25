// React 및 React Hooks
import React, { useEffect, useState } from 'react';

// React Router 라이브러리
import { useNavigate, useParams } from 'react-router-dom';

// 상수 및 환경 변수
import { API_BASE_URL } from '../constants/api.js';

// 전역 컨텍스트
import { usePostContext } from '../contexts/PostContext.jsx';

// 프로젝트 내부 컴포넌트
import InputField from '../components/ui/InputField';
import FileInput from '../components/ui/FileInput';
import SubmitButton from '../components/ui/SubmitButton';
import HelperText from '../components/ui/HelperText';
import WithAuthenticated from '../components/HOC/WithAuthenticated.jsx';
import LoadingUI from '../components/LoadingUI.jsx';

// 프로젝트 내부 에셋 (이미지 파일)
import closeIcon from '../assets/close_square_light.svg';

// 커스텀 훅
import useFetch from '../hooks/useFetch.js';

// 스타일 파일 (CSS Modules)
import styles from './PostModify.module.css';

const PostModify = () => {
  const { postId: postIdStr } = useParams();
  const postId = parseInt(postIdStr);

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [existingImage, setExistingImage] = useState(null); // 현재 선택된 이미지가 아닌 기존 게시글의 이미지 의미 (서버에 저장된)
  const [removeImageFlag, setRemoveImageFlag] = useState(false);

  const { posts, updatePost } = usePostContext();

  const { isFetching, fetchData } = useFetch();

  const validateInputs = () => {
    const isTitleFilled = title.trim() !== '' && title.length <= 26;
    const isContentFilled = content.trim() !== '';
    setIsValid(isTitleFilled && isContentFilled);
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const result = await fetchData(
          `${API_BASE_URL}/posts/${postId}`,
          true,
          { comment: 'n' },
        );

        if (result.code === 2000) {
          setTitle(result.data.title);
          setContent(result.data.content);
          if (result.data.imageUrl) {
            setExistingImage(result.data.imageUrl);
          }
        }
      } catch (error) {
        console.error('게시글 정보를 불러오는 중 오류 발생:', error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  useEffect(() => {
    validateInputs();
  }, [title, content]);

  const handleTitleChange = event => {
    setTitle(event.target.value.slice(0, 26));
  };

  const handleContentChange = event => {
    setContent(event.target.value);
  };

  const handleImageChange = event => {
    const file = event.target.files[0];

    if (file) {
      // 파일 MIME 타입 검증
      if (!file.type.startsWith("image/")) {
        alert("유효한 이미지가 아닙니다.");
        event.target.value = ""; // 입력 값 초기화
        return;
      }
    }

    setImage(file);
  };

  const handleRemoveExistingImage = () => {
    setExistingImage(null);
    setRemoveImageFlag(true);
  };

  const handleRemoveImage = () => {
    setImage(null);
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
    if (removeImageFlag) {
      formData.append('removeImageFlag', true);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();
      if (result.code === 2000) {
        const updatedPost = posts.find(post => post.postId === postId);
        updatedPost.title = formData.get('title');
        updatePost(updatedPost);
        navigate(`/post-detail/${postId}`);
      } else {
        console.error('게시글 수정 실패:', result.message);
      }
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
    }
  };

  if (isFetching) {
    return <LoadingUI isFetching={isFetching} />;
  }

  return (
    <section className={styles.postModify}>
      <div className={styles.postModifyHeader}>
        <a>게시글 수정</a>
      </div>
      <form
        id="postModifyForm"
        className={styles.postModifyForm}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <InputField
          label="제목*"
          name="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목을 입력하세요 (최대 26글자)"
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
          <HelperText helperMessage="* 제목과 내용을 입력해 주세요." />
        )}
        <div className={styles.imageContainer}>
          {existingImage && (
            <div className={styles.imagePlaceholder}>
              <img src={existingImage} alt="기존 이미지" />
              <button
                type="button"
                className={styles.removeImageBtn}
                onClick={handleRemoveExistingImage}
              >
                <img src={closeIcon} alt="기존 이미지 제거" />
              </button>
            </div>
          )}
          {image && (
            <div className={styles.imagePlaceholder}>
              <img src={URL.createObjectURL(image)} alt="선택한 이미지" />
              <button
                type="button"
                className={styles.removeImageBtn}
                onClick={handleRemoveImage}
              >
                <img src={closeIcon} alt="선택한 이미지 제거" />
              </button>
            </div>
          )}
          {!existingImage && !image && (
            <FileInput
              label="이미지"
              name="postImage"
              onChange={handleImageChange}
            />
          )}
        </div>
        <div className={styles.btnBox}>
          <SubmitButton
            isValid={isValid}
            label="수정하기"
            className={styles.postModifyBtn}
          />
        </div>
      </form>
    </section>
  );
};

export default WithAuthenticated(PostModify);
