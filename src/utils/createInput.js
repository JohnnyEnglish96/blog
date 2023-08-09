/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import styles from '../components/App/App.module.scss';

const renderErrorMessage = (field, checkbox, errors) => {
  return (
    <div className={!checkbox ? styles['error-message'] : `${styles['error-message-checkbox']}`}>
      {errors[field] && <p>{errors[field].message || 'Error'}</p>}
    </div>
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

const renderInput = (label, name, placeholder, register, errors, type = 'text', options = {}) => {
  return (
    <label>
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className={`${styles['text-input']} ${errors?.[name]?.message && styles.error}`}
        {...register(name, options)}
      />
      {renderErrorMessage(name, false, errors)}
    </label>
  );
};

export { renderInput, renderCheckbox };
