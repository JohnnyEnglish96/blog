import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import ArticleList from '../components/ArticleList';
import styles from '../components/App/App.module.scss';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 60,
    }}
    spin
  />
);

function HomePage() {
  const loading = useSelector((state) => state.articles.loading);
  const error = useSelector((state) => state.articles.error);

  const showError = (
    <Alert className={styles.error} message="Error" description={error} type="error" showIcon />
  );
  const showLoad = <Spin className={styles.spinner} indicator={antIcon} />;
  const content = error || loading ? null : <ArticleList />;

  return (
    <>
      {error && showError}
      {loading && showLoad}
      {content}
    </>
  );
}

export default HomePage;
