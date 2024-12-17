// 글로벌 스타일 파일
import './App.css';

// React Router 라이브러리
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

// 전역 상태 및 컨텍스트
import { AuthProvider } from './contexts/AuthContext.jsx';
import { PostProvider } from './contexts/PostContext.jsx';

// 프로젝트 내부 컴포넌트
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';

// 프로젝트 페이지 컴포넌트
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Index from './pages/Index.jsx';
import PostUpload from './pages/PostUpload.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PostModify from './pages/PostModify.jsx';
import UserInfoModify from './pages/UserInfoModify.jsx';
import UserPasswordModify from './pages/UserPasswordModify.jsx';

function App() {
  return (
    <Router>
      <PostProvider>
        <AuthProvider>
          <ConditionalHeader />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-upload"
              element={
                <ProtectedRoute>
                  <PostUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-detail/:postId"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-modify/:postId"
              element={
                <ProtectedRoute>
                  <PostModify />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-info-modify"
              element={
                <ProtectedRoute>
                  <UserInfoModify />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-password-modify"
              element={
                <ProtectedRoute>
                  <UserPasswordModify />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </PostProvider>
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
