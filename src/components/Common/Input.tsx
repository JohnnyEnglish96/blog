import React from 'react';
import { nanoid } from '@reduxjs/toolkit';

import styles from '../App/App.module.scss';
import { IInputProps } from '../models/IForm';

import ErrorMessage from './ErrorMessage';

const Input: React.FC<IInputProps> = ({
  label,
  name,
  placeholder,
  register,
  errors,
  type,
  options,
  article,
}) => {
  const id = nanoid();
  return (
    <label htmlFor={id}>
      {label}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`${styles['text-input']} ${errors?.[name]?.message && styles['error-border']}`}
        {...register(name, options)}
      />
      <ErrorMessage field={name} errors={errors} article={article} />
    </label>
  );
};

Input.defaultProps = {
  type: 'text',
  article: false,
};

export default Input;
