import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL, IMAGE_BASE_URL } from '../constants/api.js';
import CommentItem from '../components/post/CommentItem';
import Button from '../components/ui/Button';
import defaultProfileImage from '../assets/user_default_profile.svg'; // 프로필 기본 이미지
import styles from './PostDetail.module.css';
import classNames from 'classnames';
import { usePostContext } from '../contexts/PostContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import Modal from '../components/ui/Modal';

// 초기 상태 정의
const initialState = {
  post: null,
  isModalOpen: false,
  selectedTargetId: null,
  targetMessage: '',
  targetType: null,
  isLiked: false,
};

// 리듀서 함수 정의
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_POST':
      return {
        ...state,
        post: action.payload,
        isLiked: action.payload.isLiked,
      };
    case 'OPEN_MODAL':
      return {
        ...state,
        isModalOpen: true,
        selectedTargetId: action.payload.id,
        targetType: action.payload.type,
        targetMessage:
          action.payload.type === 'comment'
            ? '댓글을 삭제하시겠습니까?'
            : '게시글을 삭제하시겠습니까?',
      };
    case 'CLOSE_MODAL':
      return {
        ...state,
        isModalOpen: false,
        selectedTargetId: null,
        targetType: null,
        targetMessage: null,
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        post: {
          ...state.post,
          comments: [action.payload, ...state.post.comments],
        },
      };
    case 'EDIT_COMMENT':
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.map(comment =>
            comment.commentId === action.payload.commentId
              ? { ...comment, ...action.payload }
              : comment,
          ),
        },
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(
            comment => comment.commentId !== action.payload,
          ),
        },
      };
    case 'TOGGLE_LIKE':
      return {
        ...state,
        isLiked: !state.isLiked,
        post: {
          ...state.post,
          likeCount: state.isLiked
            ? state.post.likeCount - 1
            : state.post.likeCount + 1,
        },
      };
    default:
      return state;
  }
};

const PostDetail = () => {
  const { postId: postIdStr } = useParams();
  const postId = parseInt(postIdStr);
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const commentRef = useRef(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [commentInputButtonText, setCommentInputButtonText] =
    useState('댓글 등록');
  const { removePost } = usePostContext();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        console.log('게시글 정보를 불러오는 중입니다...');
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const result = await response.json();

        if (result.code === 2000) {
          console.log('게시글 정보를 성공적으로 불러왔습니다.');
          dispatch({ type: 'SET_POST', payload: result.data });
        } else {
          console.error(
            `게시글 정보를 불러오는 데 실패했습니다: ${result.message}`,
          );
        }
      } catch (error) {
        console.error('게시글 정보를 불러오는 중 오류가 발생했습니다:', error);
      }
    };

    fetchPostDetails();
  }, []);

  useEffect(() => {
    if (editCommentId) {
      commentRef.current.value = state.post.comments.find(
        comment => comment.commentId === editCommentId,
      ).content;
      setCommentInputButtonText('댓글 수정');
    } else {
      setCommentInputButtonText('댓글 등록');
    }
  }, [editCommentId, commentInputButtonText]);

  const handleDeleteConfirm = () => {
    if (state.targetType === 'comment') {
      handleDeleteComment(state.selectedTargetId);
    } else if (state.targetType === 'post') {
      handleDeletePost();
    }
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleDeletePost = async () => {
    try {
      console.log('게시글 삭제 요청 중...');
      await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      console.log('게시글이 성공적으로 삭제되었습니다.');
      removePost(postId);
      navigate('/');
    } catch (error) {
      console.error('게시글 삭제 중 오류가 발생했습니다:', error);
    }
  };

  const handleDeleteComment = async commentId => {
    try {
      console.log(`댓글 ID ${commentId} 삭제 요청 중...`);
      await fetch(`${API_BASE_URL}/posts/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ commentId }),
      });
      console.log(`댓글 ID ${commentId}이 성공적으로 삭제되었습니다.`);
      dispatch({ type: 'DELETE_COMMENT', payload: commentId });
      dispatch({ type: 'CLOSE_MODAL' });
    } catch (error) {
      console.error('댓글 삭제 중 오류가 발생했습니다:', error);
    }
  };

  const handleAddComment = async () => {
    const newComment = commentRef.current.value.trim();
    if (!newComment) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      console.log('댓글 등록 요청 중...');
      const response = await fetch(`${API_BASE_URL}/posts/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId, content: newComment }),
      });
      const result = await response.json();

      if (result.code === 2001) {
        console.log('댓글이 성공적으로 등록되었습니다.');
        dispatch({ type: 'ADD_COMMENT', payload: result.data.comment });
        commentRef.current.value = '';
      } else {
        console.error(`댓글 등록에 실패했습니다: ${result.message}`);
      }
    } catch (error) {
      console.error('댓글 등록 중 오류가 발생했습니다:', error);
    }
  };

  const handleEditComment = async commentId => {
    const comment = commentRef.current.value.trim();
    if (!comment) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    try {
      console.log('댓글 수정 요청 중...');
      const response = await fetch(`${API_BASE_URL}/posts/comments`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ commentId, content: comment }),
      });
      const result = await response.json();

      if (result.code === 2000) {
        console.log('댓글이 성공적으로 등록되었습니다.');
        dispatch({ type: 'EDIT_COMMENT', payload: result.data.comment });
        commentRef.current.value = '';
      } else {
        console.error(`댓글 수정에 실패했습니다: ${result.message}`);
      }
    } catch (error) {
      console.error('댓글 수정 중 오류가 발생했습니다:', error);
    }
  };

  const dispatchAddOrEditComment = () => {
    if (editCommentId) {
      handleEditComment(editCommentId);
      setEditCommentId(null);
    } else {
      handleAddComment();
    }
  };

  const handleToggleLike = async () => {
    try {
      const url = `${API_BASE_URL}/posts/likes`;
      const method = state.isLiked ? 'DELETE' : 'POST'; // 좋아요 상태에 따라 API 결정

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId }),
      });

      if (response.status === 204 || (await response.json()).code === 2001) {
        dispatch({ type: 'TOGGLE_LIKE' }); // 상태 업데이트
      } else {
        console.error(`좋아요 처리 실패`);
      }
    } catch (error) {
      console.error('좋아요 요청 중 오류 발생:', error);
    }
  };

  if (!state.post) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.postDetail}>
      <div className={styles.infoTop}>
        <h1 className={styles.postTitle}>{state.post.title}</h1>
        <div className={styles.postInfo}>
          <div className={styles.leftInfo}>
            <img
              src={
                state.post.author.profileImageUrl
                  ? `${IMAGE_BASE_URL}${state.post.author.profileImageUrl}`
                  : defaultProfileImage
              }
              alt="프로필 이미지"
              className={styles.profileImage}
            />
            <span className={styles.author}>{state.post.author.name}</span>
            <span className={styles.date}>{state.post.createdDateTime}</span>
          </div>
          {userId === state.post.author.id && (
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
                    payload: { id: postId, type: 'post' },
                  })
                }
                className={styles.postDetailButton}
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        {state.post.imageUrl && (
          <img
            className={styles.contentImage}
            src={`${IMAGE_BASE_URL}${state.post.imageUrl}`}
            alt="내용 이미지"
          />
        )}
        <div className={styles.contentWrapper}>
          <p>{state.post.content}</p>
        </div>
      </div>
      <div className={styles.postReaction}>
        <Button
          className={classNames(
            styles.btnReaction,
            state.isLiked ? styles.postLikedActive : undefined,
          )}
          onClick={handleToggleLike}
        >
          <div>좋아요 수</div>
          <div>{state.post.likeCount}</div>
        </Button>
        <div className={styles.btnReaction}>
          <div>조회수</div>
          <div>{state.post.viewCount}</div>
        </div>
        <div className={styles.btnReaction}>
          <div>댓글수</div>
          <div>{state.post.comments.length}</div>
        </div>
      </div>
      <div className={styles.commentForm}>
        <textarea
          ref={commentRef}
          placeholder="댓글을 입력하세요"
          className={styles.commentInput}
        />
        <div className={styles.commentSubmitButtonWrapper}>
          <Button
            label={commentInputButtonText}
            onClick={dispatchAddOrEditComment}
            className={styles.commentSubmit}
          />
        </div>
      </div>
      <div className={styles.commentList}>
        {state.post.comments.map(comment => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            userId={userId}
            onEdit={id => setEditCommentId(id) && commentRef.current.focus()}
            onDelete={id =>
              dispatch({
                type: 'OPEN_MODAL',
                payload: { id, type: 'comment' },
              })
            }
          />
        ))}
      </div>
      {state.isModalOpen && (
        <Modal
          isOpen={state.isModalOpen}
          onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          onConfirm={handleDeleteConfirm}
          message={state.targetMessage}
        >
          <p>삭제한 내용은 복구할 수 없습니다.</p>
        </Modal>
      )}
    </div>
  );
};

export default PostDetail;
