/* eslint-disable no-debugger */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Divider } from 'antd';

import { fetchNewUser } from '../../store/features/user/userThunks';
import withCommonForm from '../hoc/withCommonForm';
import { renderInput, renderCheckbox } from '../../utils/createInput';

import styles from './RegisterForm.module.scss';

function RegisterForm() {
  const dispatch = useDispatch();
  const getUserData = useSelector((state) => state.user.details);
  const defaultUser = JSON.parse(localStorage.getItem('defaultUser'));

  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      Username: defaultUser?.Username || '',
      Email: defaultUser?.Email || '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (getUserData?.errors?.email && localStorage.getItem('defaultUser')) {
      setError('Email', { type: 'manual', message: 'Email is already taken.' });
    }
    if (getUserData?.errors?.username && localStorage.getItem('defaultUser')) {
      setError(
        'Username',
        { type: 'manual', message: 'Username is already taken.' },
        { shouldFocus: true }
      );
    }
  }, [getUserData, setError]);

  const onSubmit = (data) => {
    localStorage.setItem('defaultUser', JSON.stringify(data));
    dispatch(fetchNewUser(data));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {renderInput('Username', 'Username', 'Username', register, errors, 'text', {
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

      {renderInput(
        'Repeat Password',
        'confirm_password',
        'Password',
        register,
        errors,
        'password',
        {
          required: 'This field required',
          validate: (val) => {
            if (watch('Password') !== val) {
              return 'Your passwords do not match';
            }
            return null;
          },
        }
      )}

      <Divider className={styles.devider} />

      {renderCheckbox(
        'I agree to the processing of my personal information',
        'confirmation',
        register,
        errors,
        {
          validate: () => {
            if (!watch('confirmation')) {
              return 'You have to agree to the terms';
            }
            return null;
          },
        }
      )}

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
  );
}

export default withCommonForm(RegisterForm, { formTitle: 'Create new account' });
