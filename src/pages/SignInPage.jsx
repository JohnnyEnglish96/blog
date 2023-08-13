import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import { clearRegister } from '../store/features/user/userSlice';

function SignInPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  const fromPage = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearRegister());
  }, [dispatch]);

  return <LoginForm fromPage={fromPage} />;
}

export default SignInPage;
