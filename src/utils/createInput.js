/* eslint-disable no-debugger */
/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import styles from '../components/App/App.module.scss';

const renderErrorMessage = (field, checkbox, errors, article) => {
  let className = '';

  if (!checkbox && !article) {
    className = styles['error-message'];
  } else if (article) {
    className = styles['error-message-article'];
  } else {
    className = styles['error-message-checkbox'];
  }

  return (
    <div className={className}>{errors[field] && <p>{errors[field].message || 'Error'}</p>}</div>
  );
};

const renderInput = (
  label,
  name,
  placeholder,
  register,
  errors,
  type = 'text',
  options = {},
  article = false
) => {
  return (
    <label>
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className={`${styles['text-input']} ${errors?.[name]?.message && styles['error-border']}`}
        {...register(name, options)}
      />
      {renderErrorMessage(name, false, errors, article)}
    </label>
  );
};

const renderTextArea = (
  label,
  name,
  placeholder,
  register,
  errors,
  options = {},
  className = ''
) => {
  return (
    <label>
      {label}
      <textarea placeholder={placeholder} className={className} {...register(name, options)} />
      {renderErrorMessage(name, false, errors)}
    </label>
  );
};

const renderCheckbox = (label, name, register, errors, options = {}) => {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" className={styles.radio} {...register(name, options)} />
      <span className={styles['text-confirm']}>{label}</span>
      {renderErrorMessage(name, true, errors)}
    </label>
  );
};

export { renderInput, renderCheckbox, renderTextArea };
