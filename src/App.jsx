// 글로벌 스타일 파일
import './App.css';

// React Router 라이브러리
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

// 전역 상태 및 컨텍스트
import { AuthProvider } from './contexts/AuthContext.jsx';

// 프로젝트 내부 컴포넌트
import Header from './components/Header.jsx';

// React Query 라이브러리
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 프로젝트 페이지 컴포넌트
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Index from './pages/Index.jsx';
import PostUpload from './pages/PostUpload.jsx';
import PostDetail from './pages/postdetail/PostDetail.jsx';
import PostModify from './pages/PostModify.jsx';
import UserInfoModify from './pages/UserInfoModify.jsx';
import UserPasswordModify from './pages/UserPasswordModify.jsx';

function App() {
  const queryClient = new QueryClient();

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ConditionalHeader />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Index />} />
            <Route path="/post-upload" element={<PostUpload />} />
            <Route path="/post-detail/:postId" element={<PostDetail />} />
            <Route path="/post-modify/:postId" element={<PostModify />} />
            <Route path="/user-info-modify" element={<UserInfoModify />} />
            <Route
              path="/user-password-modify"
              element={<UserPasswordModify />}
            />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

function ConditionalHeader() {
  const location = useLocation();

  let backUrl;
  switch (location.pathname) {
    case '/':
    case '/login':
      backUrl = null;
      break;
    case '/register':
      backUrl = '/login';
      break;
    default:
      backUrl = '/';
  }

  let containProfileDropdown = true;
  switch (location.pathname) {
    case '/login':
    case '/register':
      containProfileDropdown = false;
      break;
    default:
      containProfileDropdown = true;
  }

  return (
    <Header backUrl={backUrl} containProfileDropdown={containProfileDropdown} />
  );
}

export default App;
