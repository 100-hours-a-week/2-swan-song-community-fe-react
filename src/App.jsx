import './App.css';
import { BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';

function App() {
  return (
    <Router>
      <ConditionalHeader />
      <Routes></Routes>
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

  return <Header backUrl={backUrl} />;
}

export default App;
