/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface FieldError {
//   [key: string]: {
//     message: string;
//   };
// }

export interface IErrorMessageProps {
  field: string;
  checkbox?: boolean;
  errors: any;
  article?: boolean;
}

export interface ICheckboxProps extends Validation {
  label: string;
  name: string;
  errors: any;
}

export interface IInputProps extends Validation {
  label: string;
  name: string;
  placeholder?: string;
  errors: any;
  type?: string;
  article?: boolean;
}

export interface ITextAreaProps extends IInputProps {
  className?: string;
}

export interface Validation {
  register: any;
  options: any;
}

export interface LoginFormProps {
  fromPage?: string;
}

export interface IArticleFormProps {
  formTitle: string;
}

export type CommonFormProps = IArticleFormProps & LoginFormProps;
