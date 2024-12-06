import userDefaultProfile from '../assets/user_default_profile.svg';
import { API_BASE_URL, IMAGE_BASE_URL } from '../constants/api.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePagingId } from '../contexts/PagingIdContext.jsx';
import '../stylesheets/pages/index.css';

export default function Index() {
  const [posts, setPosts] = useState([]);
  const { size, lastId, hasNext, setLastId, setHasNext } = usePagingId;
  const navigate = useNavigate();

  // 게시글 데이터를 가져오는 함수
  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (size) params.append('size', size);
      if (lastId) params.append('lastId', lastId);

      const url = `${API_BASE_URL}/posts${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (data.code === 2000) {
        setPosts(prevPosts => [...prevPosts, ...data.data.content]);
        setHasNext(data.data.hasNext);
        setLastId(data.data.lastId);
      }
    } catch (error) {
      console.error('게시글 로딩 중 오류 발생:', error);
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (
      hasNext &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    ) {
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts(); // 초기 게시글 로드
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // 클린업
  }, []);

  return (
    <div className="board">
      <div className="board-header">
        <div>안녕하세요,</div>
        <div>
          아무 말 대잔치<span className="text-bold"> 게시판</span>입니다.
        </div>
      </div>
      <div className="board-action">
        <button className="btn-submit" onClick={() => navigate('/post-upload')}>
          게시글 작성
        </button>
      </div>
      <div className="post-list">
        {posts.map(post => (
          <div
            className="post-item"
            key={post.postId}
            onClick={() => navigate(`/post-detail/${post.postId}`)}
          >
            <div className="post-summary">
              <div className="upper-info">
                <div className="post-title">{post.title}</div>
              </div>
              <div className="down-info">
                <div className="post-reactions">
                  <span className="post-reaction">
                    좋아요 <span>{post.likeCount}</span>
                  </span>
                  <span className="post-reaction">
                    댓글 <span>{post.commentCount}</span>
                  </span>
                  <span className="post-reaction">
                    조회수 <span>{post.viewCount}</span>
                  </span>
                </div>
                <div className="post-date">{post.createdDateTime}</div>
              </div>
            </div>
            <div className="author-info">
              <img
                className="profile-image"
                src={
                  post.profileImageUrl
                    ? `${IMAGE_BASE_URL}/${post.profileImageUrl}`
                    : userDefaultProfile
                }
                alt="프로필 이미지"
              />
              <div className="author-name">{post.authorName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
