// 프로젝트 내부 컴포넌트
import PostUploadForm from '../components/post/PostUploadForm.jsx';
import WithAuthenticated from '../components/HOC/WithAuthenticated.jsx';

const PostUpload = () => {
  return <PostUploadForm />;
};

export default WithAuthenticated(PostUpload);
