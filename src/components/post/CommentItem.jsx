import React from 'react';
import { IMAGE_BASE_URL } from '../../constants/api.js';
import defaultProfileImage from '../../assets/user_default_profile.svg'; // 프로필 기본 이미지
import Button from '../ui/Button';
import styles from './CommentItem.module.css';

const CommentItem = ({ comment, userId, onEdit, onDelete }) => {
  return (
    <div className={styles.comment}>
      <div className={styles.commentLeftInfo}>
        <div className={styles.metadata}>
          <img
            className={styles.profileImage}
            src={
              comment.author.profileImageUrl
                ? `${IMAGE_BASE_URL}${comment.author.profileImageUrl}`
                : defaultProfileImage
            }
            alt="프로필 이미지"
          />
          <span className={styles.author}>{comment.author.name}</span>
          <span className={styles.date}>{comment.createdDateTime}</span>
        </div>
        <p>{comment.content}</p>
      </div>
      {userId === comment.author.id && (
        <div className={styles.commentRightInfo}>
          <Button
            label="수정"
            onClick={() => onEdit(comment.commentId)}
            className={styles.commentEdit}
          />
          <Button
            label="삭제"
            onClick={() => onDelete(comment.commentId)}
            className={styles.commentDelete}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
