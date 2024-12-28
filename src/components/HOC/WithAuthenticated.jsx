import { useAuth } from '../../contexts/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

function WithAuthenticated(Component) {
  return function WrappedComponent(props) {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    return <Component {...props} />;
  };
}

export default WithAuthenticated;
