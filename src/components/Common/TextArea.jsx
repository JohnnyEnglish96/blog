import React from 'react';
import { nanoid } from '@reduxjs/toolkit';

import ErrorMessage from './ErrorMessage';

function TextArea({ label, name, placeholder, register, errors, options, className }) {
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
}

TextArea.defaultProps = {
  options: {},
  className: '',
};

export default TextArea;
