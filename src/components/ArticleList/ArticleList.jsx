/* eslint-disable no-debugger */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { Pagination } from 'antd';

import Article from '../Article';
import { fetchArticles } from '../../store/reducers/articlesSlice';

import styles from './ArticleList.module.scss';

function ArticleList() {
  const dispatch = useDispatch();

  const articles = useSelector((state) => state.articles.articles);
  const amount = useSelector((state) => state.articles.amount);
  const pageNum = useSelector((state) => state.articles.pageNum);

  const handleChange = (id) => {
    dispatch(fetchArticles(id));
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
