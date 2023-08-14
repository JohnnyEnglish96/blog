import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Result, Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import ArticleList from '../components/ArticleList';
import styles from '../components/App/App.module.scss';
import { clearEdited } from '../store/features/user/userSlice';
import { fetchArticles } from '../store/features/articles/articlesThunks';

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
  const complited = useSelector((state) => state.articles.complited);
  const loadingLogout = useSelector((state) => state.user.loading);
  const errorStatus = useSelector((state) => state.articles.error);
  const pageNum = useSelector((state) => state.articles.pageNum);
  const user = localStorage.getItem('user');
  const { token } = user ? JSON.parse(user) : { token: '' };

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticles({ id: pageNum, token }));
    dispatch(clearEdited());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, token]);

  useEffect(() => {
    if (complited) {
      messageApi.open({
        type: 'success',
        content: 'Complited',
      });
    }
  }, [complited, messageApi]);

  const textError =
    errorStatus === '404'
      ? 'Sorry, the page you visited does not exist.'
      : 'Sorry, something went wrong.';

  const showError = (
    <Result
      className={styles.error}
      status={errorStatus}
      title={errorStatus}
      subTitle={textError}
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
  const showLoad = <Spin className={styles.spinner} indicator={antIcon} />;
  const content = errorStatus || loading || loadingLogout ? null : <ArticleList />;

  return (
    <>
      {contextHolder}
      {errorStatus && showError}
      {(loading || loadingLogout) && showLoad}
      {content}
    </>
  );
}

export default HomePage;
