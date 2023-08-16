import React from 'react';
import { nanoid } from '@reduxjs/toolkit';

import styles from '../App/App.module.scss';

import ErrorMessage from './ErrorMessage';

function Checkbox({ label, name, register, errors, options }) {
  const id = nanoid();
  return (
    <label htmlFor={id} className={styles.checkbox}>
      <input type="checkbox" id={id} className={styles.radio} {...register(name, options)} />
      <span className={styles['text-confirm']}>{label}</span>
      <ErrorMessage field={name} checkbox errors={errors} />
    </label>
  );
}

export default Checkbox;
