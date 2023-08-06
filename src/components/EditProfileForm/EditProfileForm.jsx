/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchEditUser } from '../../store/features/user/userThunks';
import { antIcon } from '../../pages/HomePage';

import styles from './EditProfileForm.module.scss';

function EditProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: 'all',
  });
  const navigate = useNavigate();
  const edited = useSelector((state) => state.user.edited);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const onSubmit = (data) => dispatch(fetchEditUser(data));

  if (edited) {
    navigate('/');
  }

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
      <h2 className={styles.title}>Edit Profile</h2>

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

        {renderInput('New password', 'Password', 'New password', 'password', {
          required: 'This field required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 symbols',
          },
        })}

        {renderInput('Avatar image (url)', 'Avatar', 'Avatar image', 'text', {
          required: 'This field required',
          pattern: {
            // eslint-disable-next-line prefer-regex-literals, max-len
            value: /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/g,
            message: 'Invalid URL. Example "https://www.example.com"',
          },
        })}

        <Button
          type="primary"
          htmlType="submit"
          disabled={!isValid}
          style={{ height: 40, marginTop: 7 }}
        >
          Save
        </Button>
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

export default EditProfileForm;
