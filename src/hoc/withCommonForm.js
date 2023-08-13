/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { Spin, Alert, Button, Result } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import styles from '../components/App/App.module.scss';
import { antIcon } from '../pages/HomePage';

function withCommonForm(Component, extraProps) {
  return function WrappedComponent(props) {
    const getUserData = useSelector((state) => state.user.details);
    const isRegistered = useSelector((state) => state.user.isRegistered);
    const loading = useSelector((state) => state.user.loading);
    const error = useSelector((state) => state.user.error);
    const edited = useSelector((state) => state.user.edited);

    const navigate = useNavigate();

    useEffect(() => {
      if (edited) {
        navigate('/');
      }
    }, [edited, navigate]);

    let formStyle = null;
    if (extraProps.formTitle.endsWith('account')) {
      formStyle = styles.create;
    } else if (extraProps.formTitle.includes('Edit Profile')) {
      formStyle = styles.edit;
    } else if (extraProps.formTitle.includes('Create new article')) {
      formStyle = styles['new-article'];
    } else if (extraProps.formTitle.includes('Edit article')) {
      formStyle = styles['edit-article'];
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
        <h2 className={styles.title}>{extraProps.formTitle}</h2>
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
        {extraProps.formTitle.endsWith('account') && showSuccess}
        {form}
      </>
    );
  };
}

export default withCommonForm;
