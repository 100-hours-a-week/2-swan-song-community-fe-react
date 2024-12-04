import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Header from './components/Header.jsx';
import Login from './pages/Login.jsx'

function App() {
  return (
    <AuthProvider>
        <Router>
        <ConditionalHeader />
        <Routes>
            <Route path='/login' element={<Login />}/>
        </Routes>
        </Router>
    </AuthProvider>
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

  return <Header backUrl={backUrl} />;
}

export default App;
