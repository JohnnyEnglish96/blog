import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import { clearRegister } from '../store/features/user/userSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const SignInPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const fromPage = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearRegister());
  }, [dispatch]);

  return <LoginForm fromPage={fromPage} formTitle="Sign In" />;
};

export default SignInPage;
