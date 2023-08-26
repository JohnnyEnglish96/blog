import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

import { useAppSelector } from '../hooks/useAppSelector';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();
  const isLogin = useAppSelector((state) => state.user.isLogin);

  if (!isLogin) {
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default RequireAuth;
