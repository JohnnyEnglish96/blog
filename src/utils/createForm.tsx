/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import Input from '../components/Common/Input';
import TextArea from '../components/Common/TextArea';
import Checkbox from '../components/Common/Checkbox';
import { IInputProps, ITextAreaProps } from '../components/models/IForm';

interface IRenderProps extends IInputProps, ITextAreaProps {}

function renderField<T extends IRenderProps>(Component: React.FC<T>, props: T) {
  return <Component {...props} />;
}

export const renderInput = (
  label: string,
  name: string,
  placeholder: string,
  register: any,
  errors: any,
  type = 'text',
  options: any,
  article = false
) => {
  return renderField(Input, { label, name, placeholder, register, errors, type, options, article });
};

export const renderTextArea = (
  label: string,
  name: string,
  placeholder: string,
  register: any,
  errors: any,
  options: any,
  className = ''
) => {
  return renderField(TextArea, { label, name, placeholder, register, errors, options, className });
};

export const renderCheckbox = (
  label: string,
  name: string,
  register: any,
  errors: any,
  options: any
) => {
  return renderField(Checkbox, { label, name, register, errors, options });
};
