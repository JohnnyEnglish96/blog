import React from 'react';

import styles from '../App/App.module.scss';
import { IErrorMessageProps } from '../models/IForm';

const ErrorMessage: React.FC<IErrorMessageProps> = ({ field, checkbox, errors, article }) => {
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

ErrorMessage.defaultProps = {
  article: false,
  checkbox: false,
};

export default ErrorMessage;
