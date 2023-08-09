/* eslint-disable no-debugger */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Alert, Spin } from 'antd';
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
  const error = useSelector((state) => state.articles.error);
  const article = useSelector((state) => state.articles.article);
  const dispatch = useDispatch();
  const { slug } = useParams();

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug));
  }, [dispatch, slug]);

  const showError = (
    <Alert className={styles.error} message="Error" description={error} type="error" showIcon />
  );
  const showLoad = <Spin className={styles.spinner} indicator={antIcon} />;
  const content = error || loading || !article ? null : <Article article={article} isDetailed />;

  return (
    <>
      {error && showError}
      {loading && showLoad}
      {content}
    </>
  );
}

export default ArticlePage;
