/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { Spin, Alert } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import styles from '../App/App.module.scss';
import { antIcon } from '../../pages/HomePage';

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

    if (extraProps.formTitle.startsWith('Create')) {
      formStyle = styles.create;
    } else if (extraProps.formTitle.startsWith('Edit')) {
      formStyle = styles.edit;
    }

    const showLoad = loading && <Spin className={styles.spinner} indicator={antIcon} />;

    const showError = error && (
      <Alert className={styles.error} message="Error" description={error} type="error" showIcon />
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
        {extraProps.formTitle.startsWith('Create') && showSuccess}
        {form}
      </>
    );
  };
}

export default withCommonForm;
