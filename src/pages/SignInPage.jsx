import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import LoginForm from '../components/LoginForm';
import { clearRegister } from '../store/features/user/userSlice';

function SignInPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearRegister());
  }, [dispatch]);
  return <LoginForm />;
}

export default SignInPage;
