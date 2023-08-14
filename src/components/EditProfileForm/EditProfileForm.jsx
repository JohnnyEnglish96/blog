/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { fetchEditUser } from '../../store/features/user/userThunks';
import withCommonForm from '../../hoc/withCommonForm';
import { renderInput } from '../../utils/createInput';

import styles from './EditProfileForm.module.scss';

function EditProfileForm() {
  const edited = useSelector((state) => state.user.edited);
  const getUserData = useSelector((state) => state.user.details);
  const defaultUser = JSON.parse(localStorage.getItem('defaultUser'));
  const navigate = useNavigate();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      Username: defaultUser?.Username || '',
      Email: defaultUser?.Email || '',
    },
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

  useEffect(() => {
    if (edited) {
      navigate('/');
    }
  }, [edited, navigate]);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    localStorage.setItem('defaultUser', JSON.stringify(data));
    dispatch(fetchEditUser(data));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {renderInput('Username', 'Username', 'Username', register, errors, 'text', {
        required: 'This field required',
        pattern: {
          value: /^[a-z][a-z0-9]{0,19}\s?[a-z0-9]{0,19}$/gm,
          message: 'Invalid username, example abcd123',
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

      {renderInput('New password', 'Password', 'New password', register, errors, 'password', {
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

      {renderInput('Avatar image (url)', 'Avatar', 'Avatar image', register, errors, 'text', {
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
  );
}

export default withCommonForm(EditProfileForm, { formTitle: 'Edit Profile' });
