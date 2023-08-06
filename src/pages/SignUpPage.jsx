import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import RegisterForm from '../components/RegisterForm/RegisterForm';
import { clearHache } from '../store/features/user/userSlice';

function SignUpPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearHache());
  }, [dispatch]);
  return <RegisterForm />;
}
export default SignUpPage;
