import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArticleList from '../components/ArticleList';
import styles from '../components/App/App.module.scss';
import { clearEdited } from '../store/features/user/userSlice';

export const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 60,
    }}
    spin
  />
);

function HomePage() {
  const loading = useSelector((state) => state.articles.loading);
  const loadingLogout = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.articles.error);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearEdited());
  }, [dispatch]);

  const showError = (
    <Alert className={styles.error} message="Error" description={error} type="error" showIcon />
  );
  const showLoad = <Spin className={styles.spinner} indicator={antIcon} />;
  const content = error || loading || loadingLogout ? null : <ArticleList />;

  return (
    <>
      {error && showError}
      {(loading || loadingLogout) && showLoad}
      {content}
    </>
  );
}

export default HomePage;
