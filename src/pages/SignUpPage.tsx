import React, { useEffect } from 'react';

import RegisterForm from '../components/RegisterForm/RegisterForm';
import { clearHache } from '../store/features/user/userSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const SignUpPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearHache());
  }, [dispatch]);
  return <RegisterForm formTitle="Create new account" />;
};
export default SignUpPage;
