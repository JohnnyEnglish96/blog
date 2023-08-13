import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const location = useLocation();
  const isLogin = useSelector((state) => state.user.isLogin);

  if (!isLogin) {
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
