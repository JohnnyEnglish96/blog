import React from 'react';

import Input from '../components/Common/Input';
import TextArea from '../components/Common/TextArea';
import Checkbox from '../components/Common/Checkbox';

const renderField = (Component, props) => {
  return <Component {...props} />;
};

export const renderInput = (
  label,
  name,
  placeholder,
  register,
  errors,
  type = 'text',
  options = {},
  article = false
) => {
  return renderField(Input, { label, name, placeholder, register, errors, type, options, article });
};

export const renderTextArea = (
  label,
  name,
  placeholder,
  register,
  errors,
  options = {},
  className = ''
) => {
  return renderField(TextArea, { label, name, placeholder, register, errors, options, className });
};

export const renderCheckbox = (label, name, register, errors, options = {}) => {
  return renderField(Checkbox, { label, name, register, errors, options });
};
