/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Divider, Spin, Alert } from 'antd';

import { antIcon } from '../../pages/HomePage';
import { fetchNewUser } from '../../store/features/user/userThunks';

import styles from './RegisterForm.module.scss';

function RegisterForm() {
  const dispatch = useDispatch();
  const getUserData = useSelector((state) => state.user.details);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
  });

  useEffect(() => {
    if (getUserData?.errors?.email) {
      setError('Email', { type: 'manual', message: 'Email is already taken.' });
    }
    if (getUserData?.errors?.username) {
      setError(
        'Username',
        { type: 'manual', message: 'Username is already taken.' },
        { shouldFocus: true }
      );
    }
  }, [getUserData, setError]);

  const onSubmit = (data) => dispatch(fetchNewUser(data));

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

  const renderCheckbox = (label, name, options = {}) => {
    return (
      <label className={styles.checkbox}>
        <input type="checkbox" className={styles.radio} {...register(name, options)} />
        <span className={styles['text-confirm']}>{label}</span>
        {renderErrorMessage(name, true)}
      </label>
    );
  };

  const showError = error && (
    <Alert className={styles.error} message="Error" description={error} type="error" showIcon />
  );
  const showLoad = loading && <Spin className={styles.spinner} indicator={antIcon} />;
  const content = !loading && (
    <>
      <h2 className={styles.title}>Create new account</h2>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {renderInput('Username', 'Username', 'Username', 'text', {
          required: 'This field required',
          pattern: {
            value: /^[A-Za-z][A-Za-z0-9]{2,20}$/gi,
            message: 'Invalid username, example Abcd123',
          },
          maxLength: {
            value: 20,
            message: 'Username must be under 20 symbols',
          },
          minLength: {
            value: 3,
            message: 'Username must be at least 3 symbols',
          },
        })}

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

        {renderInput('Repeat Password', 'confirm_password', 'Password', 'password', {
          required: 'This field required',
          validate: (val) => {
            if (watch('Password') !== val) {
              return 'Your passwords do not match';
            }
            return null;
          },
        })}

        <Divider className={styles.devider} />

        {renderCheckbox('I agree to the processing of my personal information', 'confirmation', {
          validate: () => {
            if (!watch('confirmation')) {
              return 'You have to agree to the terms';
            }
            return null;
          },
        })}

        <Button
          type="primary"
          htmlType="submit"
          disabled={!isValid}
          style={{ height: 40, marginTop: -5 }}
        >
          Submit
        </Button>

        <p className={styles['bottom-link']}>
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </p>
      </form>
    </>
  );
  const success = getUserData?.user;
  const showSuccess = success && (
    <Alert
      className={styles.success}
      message="Success"
      description={
        <>
          Registration completed successfully! You can <Link to="/sign-in">login</Link> now
        </>
      }
      type="success"
      showIcon
    />
  );

  const form =
    !error && !success ? (
      <div className={styles['form-wrapper']}>
        {showLoad}
        {content}
      </div>
    ) : null;

  return (
    <>
      {showError}
      {showSuccess}
      {form}
    </>
  );
}

export default RegisterForm;
