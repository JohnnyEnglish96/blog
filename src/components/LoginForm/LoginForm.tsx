import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { fetchLoginUser } from '../../store/features/user/userThunks';
import withCommonForm from '../../hoc/withCommonForm';
import { renderInput } from '../../utils/createForm';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { IUserForm } from '../models/IUser';
import { LoginFormProps } from '../models/IForm';
import { useAppSelector } from '../../hooks/useAppSelector';

import styles from './LoginForm.module.scss';

const LoginForm: React.FC<LoginFormProps> = ({ fromPage }) => {
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const getUserData = useAppSelector((state) => state.user.details);
  const navigate = useNavigate();
  const defaultUser = JSON.parse(localStorage.getItem('defaultUser') as string);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLogin) {
      navigate(fromPage!, { replace: true });
    }
  }, [fromPage, isLogin, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<IUserForm>({
    defaultValues: {
      Email: defaultUser?.Email || '',
      Password: defaultUser?.Password || '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<IUserForm> = (data) => {
    localStorage.setItem('defaultUser', JSON.stringify(data));
    dispatch(fetchLoginUser(data));
  };

  useEffect(() => {
    if (getUserData?.errors) {
      setError(
        'Email',
        { type: 'manual', message: 'Email or password is invalid.' },
        { shouldFocus: true }
      );
      setError('Password', { type: 'manual', message: 'Email or password is invalid.' });
    }
  }, [getUserData, setError]);

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {renderInput('Email address', 'Email', 'Email', register, errors, 'text', {
        required: 'This field required',
        pattern: {
          value: /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gm,
          message: 'Invalid email, example abc@bca.com',
        },
      })}

      {renderInput('Password', 'Password', 'Password', register, errors, 'password', {
        required: 'This field required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 symbols',
        },
        maxLength: {
          value: 40,
          message: 'Password must be under 40 symbols',
        },
      })}

      <Button
        type="primary"
        htmlType="submit"
        disabled={!isValid}
        style={{ height: 40, marginTop: -5 }}
      >
        Login
      </Button>

      <p className={styles['bottom-link']}>
        Don’t have an account? <Link to="/sign-up">Sign Up</Link> .
      </p>
    </form>
  );
};

export default withCommonForm(LoginForm);
