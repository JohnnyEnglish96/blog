import React from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { Pagination } from 'antd';

import Article from '../Article';
import { fetchArticles } from '../../store/features/articles/articlesThunks';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';

import styles from './ArticleList.module.scss';

const ArticleList: React.FC = () => {
  const dispatch = useAppDispatch();

  const articles = useAppSelector((state) => state.articles.articles);
  const amount = useAppSelector((state) => state.articles.amount);
  const pageNum = useAppSelector((state) => state.articles.pageNum);
  const user = localStorage.getItem('user');
  const { token } = user ? JSON.parse(user) : { token: '' };

  const handleChange = (id: number) => {
    sessionStorage.setItem('pageNum', id.toString());
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
};

export default ArticleList;
