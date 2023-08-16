import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { Pagination } from 'antd';

import Article from '../Article';
import { fetchArticles } from '../../store/features/articles/articlesThunks';

import styles from './ArticleList.module.scss';

function ArticleList() {
  const dispatch = useDispatch();

  const articles = useSelector((state) => state.articles.articles);
  const amount = useSelector((state) => state.articles.amount);
  const pageNum = useSelector((state) => state.articles.pageNum);
  const user = localStorage.getItem('user');
  const { token } = user ? JSON.parse(user) : { token: '' };

  const handleChange = (id) => {
    sessionStorage.setItem('pageNum', id);
    dispatch(fetchArticles({ id, token }));
  };

  return (
    <>
      <ul className={styles['article-list']}>
        {articles.map((article) => {
          return (
            <li key={nanoid()}>
              <Article article={article} />
            </li>
          );
        })}
      </ul>
      <Pagination
        current={pageNum}
        total={amount}
        showSizeChanger={false}
        defaultPageSize={5}
        onChange={handleChange}
      />
    </>
  );
}

export default ArticleList;
