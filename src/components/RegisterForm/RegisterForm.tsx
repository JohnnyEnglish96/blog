import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button, Divider } from 'antd';

import { fetchNewUser } from '../../store/features/user/userThunks';
import withCommonForm from '../../hoc/withCommonForm';
import { renderInput, renderCheckbox } from '../../utils/createForm';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { IUserForm } from '../models/IUser';
import { useAppSelector } from '../../hooks/useAppSelector';

import styles from './RegisterForm.module.scss';

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const getUserData = useAppSelector((state) => state.user.details);
  const defaultUser = JSON.parse(localStorage.getItem('defaultUser') as string);
  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IUserForm>({
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

  const onSubmit: SubmitHandler<IUserForm> = (data) => {
    localStorage.setItem('defaultUser', JSON.stringify(data));
    dispatch(fetchNewUser(data));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      {renderInput('Username', 'Username', 'Username', register, errors, 'text', {
        required: 'This field required',
        pattern: {
          value: /^[a-z][a-z0-9]{0,19}[a-z0-9]{0,19}$/gm,
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
          validate: (val: string | null) => {
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
};

export default withCommonForm(RegisterForm);
