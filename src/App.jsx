import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { PagingIdProvider } from './contexts/PagingIdContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Index from './pages/Index.jsx';
import PostUpload from './pages/PostUpload.jsx';
import PostDetail from './pages/PostDetail.jsx';

function App() {
  return (
    <Router>
      <PagingIdProvider>
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
          </Routes>
        </AuthProvider>
      </PagingIdProvider>
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
