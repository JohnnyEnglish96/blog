import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Button, Result, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import styles from '../components/App/App.module.scss';
import Article from '../components/Article';
import { fetchArticleBySlug } from '../store/features/articles/articlesThunks';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 60,
    }}
    spin
  />
);

function ArticlePage() {
  const loading = useSelector((state) => state.articles.loading);
  const errorStatus = useSelector((state) => state.articles.error);
  const article = useSelector((state) => state.articles.article);
  const dispatch = useDispatch();
  const { slug } = useParams();
  const user = localStorage.getItem('user');
  const { token } = user ? JSON.parse(user) : { token: '' };

  useEffect(() => {
    dispatch(fetchArticleBySlug({ slug, token }));
  }, [dispatch, slug, token]);

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
  const content =
    errorStatus || loading || !article ? null : <Article article={article} isDetailed />;

  return (
    <>
      {errorStatus && showError}
      {loading && showLoad}
      {content}
    </>
  );
}

export default ArticlePage;
