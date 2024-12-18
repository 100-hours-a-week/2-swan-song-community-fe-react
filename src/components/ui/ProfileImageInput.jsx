// React 라이브러리
import React, { useState } from 'react';

// 프로젝트 내부 에셋 (이미지 파일)
import addFileImage from '../../assets/add_round_light.svg';

// 스타일 파일 (CSS Modules)
import styles from './ProfileImageInput.module.css';

const FileInput = ({ label, name, onChange, preview }) => {
  const [imagePreview, setImagePreview] = useState(preview);

  const handleImageChange = event => {
    const file = event.target.files[0];
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
            <img
              className={styles.imagePreview}
              src={imagePreview}
              alt="Image Preview"
            />
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
