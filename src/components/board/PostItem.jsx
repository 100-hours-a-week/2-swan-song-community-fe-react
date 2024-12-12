import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostItem.module.css";
import userDefaultProfile from "../../assets/user_default_profile.svg";
import { IMAGE_BASE_URL } from "../../constants/api";

const PostItem = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.postItem} onClick={() => navigate(`/post-detail/${post.postId}`)}>
      <div className={styles.postSummary}>
        <div className={styles.upperInfo}>
          <div className={styles.postTitle}>{post.title}</div>
        </div>
        <div className={styles.downInfo}>
          <div className={styles.postReactions}>
            <span className={styles.postReaction}>
              좋아요 <span>{post.likeCount}</span>
            </span>
            <span className={styles.postReaction}>
              댓글 <span>{post.commentCount}</span>
            </span>
            <span className={styles.postReaction}>
              조회수 <span>{post.viewCount}</span>
            </span>
          </div>
          <div className={styles.postDate}>{post.createdDateTime}</div>
        </div>
      </div>
      <div className={styles.authorInfo}>
        <img
          className={styles.profileImage}
          src={post.profileImageUrl ? `${IMAGE_BASE_URL}/${post.profileImageUrl}` : userDefaultProfile}
          alt="프로필 이미지"
        />
        <div className={styles.authorName}>{post.authorName}</div>
      </div>
    </div>
  );
};

export default PostItem;