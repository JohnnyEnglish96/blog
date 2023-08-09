import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';

import EditProfileForm from '../components/EditProfileForm';
import styles from '../components/App/App.module.scss';

import { antIcon } from './HomePage';

function EditProfilePage() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const loadingLogout = useSelector((state) => state.user.loading);
  const navigator = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigator('/');
    }
  }, [isLogin, navigator]);

  const showLoad = <Spin className={styles.spinner} indicator={antIcon} />;
  const content = loadingLogout ? null : <EditProfileForm />;

  return (
    <>
      {loadingLogout && showLoad}
      {content}
    </>
  );
}

export default EditProfilePage;
