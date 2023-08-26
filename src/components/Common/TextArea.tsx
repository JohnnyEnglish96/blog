import React from 'react';
import { nanoid } from '@reduxjs/toolkit';

import { ITextAreaProps } from '../models/IForm';

import ErrorMessage from './ErrorMessage';

const TextArea: React.FC<ITextAreaProps> = ({
  label,
  name,
  placeholder,
  register,
  errors,
  options,
  className,
}) => {
  const id = nanoid();
  return (
    <label htmlFor={id}>
      {label}
      <textarea
        placeholder={placeholder}
        id={id}
        className={className}
        {...register(name, options)}
      />
      <ErrorMessage field={name} errors={errors} />
    </label>
  );
};

TextArea.defaultProps = {
  className: '',
};

export default TextArea;
