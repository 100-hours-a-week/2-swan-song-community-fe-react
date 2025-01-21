import React, { useReducer, useState } from 'react';

// 전역 상태 및 컨텍스트
import { usePostContext } from '../../contexts/PostContext.jsx';

// 프로젝트 내부 컴포넌트
import CommentItem from '../../components/post/CommentItem.jsx';
import { API_BASE_URL } from '../../constants/api.js';
import SubmitButton from '../../components/ui/SubmitButton.jsx';

// 스타일 파일 (CSS Modules)
import styles from './PostCommentWrapper.module.css';

// 리듀서
const commentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.payload,
        commentCount: action.payload.length,
      };
    case 'ADD_COMMENT':
      action.setPost({
        ...action.post,
        commentCount: action.post.commentCount + 1,
      });
      return {
        ...state,
        comments: [action.payload, ...state.comments],
        commentCount: state.commentCount + 1,
      };
    case 'EDIT_COMMENT':
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.commentId === action.payload.commentId
            ? { ...comment, ...action.payload }
            : comment,
        ),
      };
    case 'DELETE_COMMENT':
      action.setPost({
        ...action.post,
        commentCount: action.post.commentCount - 1,
      });
      return {
        ...state,
        comments: state.comments.filter(
          comment => comment.commentId !== action.payload,
        ),
        commentCount: state.commentCount - 1,
      };
    default:
      return state;
  }
};

export default function PostCommentWrapper({
  post,
  setPost,
  postId,
  userId,
  parentDispatch,
}) {
  const [state, dispatch] = useReducer(commentReducer, {
    comments: post.comments,
    commentCount: post.comments.length,
  });
  const { posts, updatePost } = usePostContext();
  const [commentInputText, setCommentInputText] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);

  // 버튼 텍스트 동적 설정
  const commentInputButtonText = editCommentId ? '댓글 수정' : '댓글 등록';

  // 댓글 추가
  const addComment = async content => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId, content }),
      });
      const result = await response.json();

      if (result.code === 2001) {
        dispatch({
          type: 'ADD_COMMENT',
          payload: result.data.comment,
          post,
          setPost,
        });

        setCommentInputText('');

        const updatedPost = posts.find(post => post.postId === postId);
        updatedPost.commentCount += 1;
        updatePost(updatedPost);
      } else if (result.code === 4000) {
        alert(result.message);
      } else {
        console.error('댓글 등록 실패:', result.message);
      }
    } catch (error) {
      console.error('댓글 등록 중 오류 발생:', error);
    }
  };

  // 댓글 수정
  const editComment = async (id, content) => {
    const comment = commentInputText.trim();
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
        body: JSON.stringify({ commentId: id, content }),
      });
      const result = await response.json();

      if (result.code === 2000) {
        console.log('댓글이 성공적으로 수정되었습니다.');
        dispatch({ type: 'EDIT_COMMENT', payload: result.data.comment });
        setEditCommentId(null);
        setCommentInputText('');
      } else if (result.code === 4000) {
        alert(result.message);
      } else {
        console.error(`댓글 수정에 실패했습니다: ${result.message}`);
      }
    } catch (error) {
      console.error('댓글 수정 중 오류가 발생했습니다:', error);
    }
  };

  // 댓글 삭제
  const deleteComment = async id => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/comments`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: id }),
      });
      if (response.status === 204) {
        dispatch({ type: 'DELETE_COMMENT', payload: id, post, setPost });
        const updatedPost = posts.find(post => post.postId === postId);
        updatedPost.commentCount -= 1;
        updatePost(updatedPost);
      } else {
        console.error('댓글 삭제 실패');
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  // 댓글 추가 또는 수정 핸들러
  const handleAddOrEditComment = () => {
    const trimmedComment = commentInputText.trim();
    if (!trimmedComment) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (editCommentId) {
      editComment(editCommentId, trimmedComment);
    } else {
      addComment(trimmedComment);
    }
  };

  // 수정 상태로 변경
  const handleEdit = (id, content) => {
    setEditCommentId(id);
    setCommentInputText(content);
  };

  return (
    <div className={styles.postCommentWrapper}>
      {/* 댓글 입력 폼 */}
      <div className={styles.commentForm}>
        <textarea
          value={commentInputText}
          onChange={e => setCommentInputText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className={styles.commentInput}
        />
        <div className={styles.commentSubmitButtonWrapper}>
          <div
            className={styles.commentWrapperCommentCount}
          >{`댓글수 ${state.commentCount}`}</div>
          <SubmitButton
            label={commentInputButtonText}
            onClick={handleAddOrEditComment}
            className={styles.commentSubmit}
          />
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className={styles.commentList}>
        {state.comments.map(comment => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            userId={userId}
            onEdit={() => handleEdit(comment.commentId, comment.content)}
            onDelete={() =>
              parentDispatch({
                type: 'OPEN_MODAL',
                payload: {
                  id: comment.commentId,
                  type: 'comment',
                  actionFn: () => {
                    deleteComment(comment.commentId);
                  },
                },
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
