/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Spin, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchGetUser } from '../../store/features/user/userThunks';
import { antIcon } from '../../pages/HomePage';

import styles from './LoginForm.module.scss';

function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
  });
  const getUserData = useSelector((state) => state.user.details);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const isLogin = useSelector((state) => state.user.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => dispatch(fetchGetUser(data));

  useEffect(() => {
    if (getUserData?.errors) {
      setError(
        'Email',
        { type: 'manual', message: 'Email or password is invalid.' },
        { shouldFocus: true }
      );
      setError('Password', { type: 'manual', message: 'Email or password is invalid.' });
    }
  }, [getUserData?.errors, setError]);

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  const renderErrorMessage = (field, checkbox) => {
    return (
      <div
        className={
          !checkbox ? styles['error-message'] : `${styles['error-message']} ${styles.checkBox}`
        }
      >
        {errors[field] && <p>{errors[field].message || 'Error'}</p>}
      </div>
    );
  };

  const renderInput = (label, name, placeholder, type = 'text', options = {}) => {
    return (
      <label>
        {label}
        <input
          type={type}
          placeholder={placeholder}
          className={errors?.[name]?.message && styles.error}
          {...register(name, options)}
        />
        {renderErrorMessage(name)}
      </label>
    );
  };

  const showError = error && (
    <Alert className={styles.error} message="Error" description={error} type="error" showIcon />
  );
  const showLoad = loading && <Spin className={styles.spinner} indicator={antIcon} />;
  const content = !loading && (
    <>
      <h2 className={styles.title}>Sign In</h2>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {renderInput('Email address', 'Email', 'Email', 'text', {
          required: 'This field required',
          pattern: {
            value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/gi,
            message: 'Invalid email, example abc@bca.com',
          },
        })}

        {renderInput('Password', 'Password', 'Password', 'password', {
          required: 'This field required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 symbols',
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
    </>
  );

  const form = !error && (
    <div className={styles['form-wrapper']}>
      {showLoad}
      {content}
    </div>
  );

  return (
    <>
      {showError}
      {form}
    </>
  );
}

export default LoginForm;
