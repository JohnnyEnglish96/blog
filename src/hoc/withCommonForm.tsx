import React, { useEffect } from 'react';
import { Spin, Alert, Button, Result } from 'antd';
import { useNavigate, Link } from 'react-router-dom';

import styles from '../components/App/App.module.scss';
import { antIcon } from '../pages/HomePage';
import { CommonFormProps } from '../components/models/IForm';
import { useAppSelector } from '../hooks/useAppSelector';

function withCommonForm<T extends CommonFormProps>(Component: React.FC<T>) {
  const WrappedComponent = (props: T) => {
    const getUserData = useAppSelector((state) => state.user.details);
    const isRegistered = useAppSelector((state) => state.user.isRegistered);
    const loading = useAppSelector((state) => state.user.loading);
    const error = useAppSelector((state) => state.user.error);
    const edited = useAppSelector((state) => state.user.edited);
    const { formTitle } = props || {};

    const navigate = useNavigate();

    useEffect(() => {
      if (edited) {
        navigate('/');
      }
    }, [edited, navigate]);

    let formStyle = null;
    if (formTitle) {
      if (formTitle.endsWith('account')) {
        formStyle = styles.create;
      } else if (formTitle.includes('Edit Profile')) {
        formStyle = styles.edit;
      } else if (formTitle.includes('Create new article')) {
        formStyle = styles['new-article'];
      } else if (formTitle.includes('Edit article')) {
        formStyle = styles['edit-article'];
      }
    }

    const showLoad = loading && <Spin className={styles.spinner} indicator={antIcon} />;
    const textError =
      error === '404'
        ? 'Sorry, the page you visited does not exist.'
        : 'Sorry, something went wrong.';

    const showError = error && (
      <Result
        className={styles.error}
        status={error}
        title={error}
        subTitle={textError}
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );

    const formContent = <Component {...props} />;

    const success = getUserData?.user;
    const showSuccess = success && (
      <Alert
        className={styles.success}
        message="Success"
        description={
          <>
            Registration completed successfully! You can <Link to="/sign-in">login</Link> now
          </>
        }
        type="success"
        showIcon
      />
    );

    const content = !loading && (
      <>
        <h2 className={styles.title}>{formTitle}</h2>
        {formContent}
      </>
    );

    const form =
      error || isRegistered ? null : (
        <div className={`${styles['form-wrapper']} ${formStyle}`}>
          {showLoad}
          {content}
        </div>
      );

    return (
      <>
        {showError}
        {formTitle && formTitle.endsWith('account') && showSuccess}
        {form}
      </>
    );
  };
  return WrappedComponent;
}

export default withCommonForm;
