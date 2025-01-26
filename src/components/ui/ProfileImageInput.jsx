// React 라이브러리
import React, { useState } from 'react';

// 프로젝트 내부 에셋 (이미지 파일)
import addFileImage from '../../assets/add_round_light.svg';
import Button from './Button.jsx';

// 스타일 파일 (CSS Modules)
import styles from './ProfileImageInput.module.css';
import closeIcon from '../../assets/close_square_light.svg';

const FileInput = ({ label, name, onChange, preview, onClickDeleteBtn }) => {
  const [imagePreview, setImagePreview] = useState(preview);

  const handleImageChange = event => {
    const file = event.target.files[0];

    if (file) {
      // 파일 MIME 타입 검증
      if (!file.type.startsWith('image/')) {
        alert('유효한 이미지가 아닙니다.');
        event.target.value = ''; // 입력 값 초기화
        setImagePreview(null);
        return;
      }

      // 파일 크기 검증
      if (file.size > 1024 * 1024 * 5) {
        alert('이미지는 5MB 이하로 업로드 가능합니다.');
        event.target.value = ''; // 입력 값 초기화
        setImagePreview(null);
        return;
      }
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      if (onChange) {
        onChange(event);
      }
    }
  };

  return (
    <div className={styles.inputBoxImage}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.imagePlaceholderWrapper}>
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />
        <div
          className={styles.imagePlaceholder}
          onClick={() => document.getElementById(name).click()}
        >
          {imagePreview ? (
            <>
              <img
                className={styles.imagePreview}
                src={imagePreview}
                alt="Image Preview"
              />
              <Button
                className={styles.removeImageBtn}
                onClick={event => {
                  event.stopPropagation(); // 이벤트 버블링 방지
                  setImagePreview(null);
                  onClickDeleteBtn();
                }}
              >
                <img src={closeIcon} alt="Remove" />
              </Button>
            </>
          ) : (
            <img
              className={styles.placeholderPlus}
              src={addFileImage}
              alt="Add"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInput;
