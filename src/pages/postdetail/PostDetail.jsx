// React 및 React Hooks
import React, { useEffect, useReducer, useRef, useState } from 'react';

// React Router 라이브러리
import { useNavigate, useParams } from 'react-router-dom';

// 상수 및 환경 변수
import { API_BASE_URL, IMAGE_BASE_URL } from '../../constants/api.js';

// 외부 라이브러리
import classNames from 'classnames';

// 전역 상태 및 컨텍스트
import { usePostContext } from '../../contexts/PostContext.jsx';

// 프로젝트 내부 컴포넌트
import Button from '../../components/ui/Button.jsx';
import RemoveModal from '../../components/ui/RemoveModal.jsx';
import WithAuthenticated from '../../components/HOC/WithAuthenticated.jsx';
import LoadingUI from '../../components/LoadingUI.jsx';
import PostCommentWrapper from './PostCommentWrapper.jsx';

// 커스텀 훅
import useFetch from '../../hooks/useFetch.js';

// 프로젝트 내부 에셋 (이미지 파일)
import defaultProfileImage from '../../assets/user_default_profile.svg'; // 프로필 기본 이미지

// 스타일 파일 (CSS Modules)
import styles from './PostDetail.module.css';

// 초기 상태 정의
const initialState = {
  isModalOpen: false,
  selectedTargetId: null, // 삭제 대상 ID
  targetMessage: '', // 모달 창에 표시할 메시지
  targetType: null, // 삭제 대상 타입 (게시글 또는 댓글)
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        isModalOpen: true,
        selectedTargetId: action.payload.id,
        targetType: action.payload.type,
        targetMessage:
          action.payload.type === 'comment'
            ? '댓글을 삭제하시겠습니까?'
            : '게시글을 삭제하시겠습니까?',
        targetActionFn: action.payload.actionFn,
      };
    case 'CLOSE_MODAL':
      return {
        isModalOpen: false,
        selectedTargetId: null,
        targetType: null,
        targetMessage: null,
      };
    default:
      return state;
  }
};

const PostDetail = () => {
  const { postId: postIdStr } = useParams();
  const postId = parseInt(postIdStr, 10);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { updatePost, removePost } = usePostContext();
  const userId = useRef(null);
  const [post, setPost] = useState(null);

  const { fetchData: fetchPost, isFetching: isFetchingPost } = useFetch();
  const { fetchData: fetchUser, isFetching: isFetchingUser } = useFetch();

  useEffect(() => {
    const initialize = async () => {
      const data = await fetchUser(`${API_BASE_URL}/users/me`, true);
      userId.current = data.data.userId;

      const fetchedPost = await fetchPost(
        `${API_BASE_URL}/posts/${postId}`,
        true,
      );
      setPost(fetchedPost.data);
    };
    initialize();
  }, []);

  const handleDeletePost = async () => {
    try {
      await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      removePost(postId);
      navigate('/');
    } catch (error) {
      console.error('게시글 삭제 중 오류가 발생했습니다:', error);
    }
  };

  const handleDeleteConfirm = () => {
    state.targetActionFn();
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleToggleLike = async () => {
    try {
      const url = `${API_BASE_URL}/posts/likes`;
      const method = post.isLiked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId }),
      });

      if (response.status === 204) {
        post.isLiked = false;
        post.likeCount -= 1;
        setPost({ ...post });
        updatePost(post);
      } else if ((await response.json()).code === 2001) {
        post.isLiked = true;
        post.likeCount += 1;
        setPost({ ...post });
        updatePost(post);
      } else {
        console.error(`좋아요 처리 실패`);
      }
    } catch (error) {
      console.error('좋아요 요청 중 오류 발생:', error);
    }
  };

  if (!post || isFetchingPost || isFetchingUser) {
    return <LoadingUI isFetching={isFetchingPost || isFetchingUser} />;
  }

  return (
    <div className={styles.postDetail}>
      <div className={styles.infoTop}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postInfo}>
          <div className={styles.leftInfo}>
            <img
              src={
                post.author.profileImageUrl
                  ? `${IMAGE_BASE_URL}${post.author.profileImageUrl}`
                  : defaultProfileImage
              }
              alt="프로필 이미지"
              className={styles.profileImage}
            />
            <span className={styles.author}>{post.author.name}</span>
            <span className={styles.date}>{post.createdDateTime}</span>
          </div>
          {userId.current === post.author.id && (
            <div>
              <Button
                label="수정"
                onClick={() => navigate(`/post-modify/${postId}`)}
                className={styles.postDetailButton}
              />
              <Button
                label="삭제"
                onClick={() =>
                  dispatch({
                    type: 'OPEN_MODAL',
                    payload: {
                      id: postId,
                      type: 'post',
                      actionFn: handleDeletePost,
                    },
                  })
                }
                className={styles.postDetailButton}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        {post.imageUrl && (
          <img
            className={styles.contentImage}
            src={`${IMAGE_BASE_URL}${post.imageUrl}`}
            alt="내용 이미지"
          />
        )}
        <div className={styles.contentWrapper}>
          <p>{post.content}</p>
        </div>
      </div>
      <div className={styles.postReaction}>
        <Button
          className={classNames(
            styles.btnReaction,
            post.isLiked ? styles.postLikedActive : undefined,
          )}
          onClick={handleToggleLike}
        >
          <div>좋아요 수</div>
          <div>{post.likeCount}</div>
        </Button>
        <div className={styles.btnReaction}>
          <div>조회수</div>
          <div>{post.viewCount}</div>
        </div>
        <div className={styles.btnReaction}>
          <div>댓글수</div>
          <div>{post.commentCount}</div>
        </div>
      </div>
      {/* 댓글 래퍼 */}
      <PostCommentWrapper
        post={post}
        setPost={setPost}
        postId={postId}
        userId={userId.current}
        parentDispatch={dispatch}
      />
      {state.isModalOpen && (
        <RemoveModal
          isOpen={state.isModalOpen}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          onConfirm={handleDeleteConfirm}
          message={state.targetMessage}
        >
          <p>삭제한 내용은 복구할 수 없습니다.</p>
        </RemoveModal>
      )}
    </div>
  );
};

export default WithAuthenticated(PostDetail);
