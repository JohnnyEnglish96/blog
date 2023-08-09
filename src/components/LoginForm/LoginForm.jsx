/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchGetUser } from '../../store/features/user/userThunks';
import withCommonForm from '../hoc/withCommonForm';
import { renderInput } from '../../utils/createInput';

import styles from './LoginForm.module.scss';

function LoginForm() {
  const getUserData = useSelector((state) => state.user.details);
  const defaultUser = JSON.parse(localStorage.getItem('defaultUser'));
  const isLogin = useSelector((state) => state.user.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      Email: defaultUser?.Email || '',
      Password: defaultUser?.Password || '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    localStorage.setItem('defaultUser', JSON.stringify(data));
    dispatch(fetchGetUser(data));
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

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

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
}

export default withCommonForm(LoginForm, { formTitle: 'Sign In' });
