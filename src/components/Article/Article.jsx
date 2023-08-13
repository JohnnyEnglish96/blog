/* eslint-disable no-debugger */
import React from 'react';
import { Tag, Button, Popconfirm } from 'antd';
import { format } from 'date-fns';
import { nanoid } from '@reduxjs/toolkit';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';

import heart from '../../assets/img/heart.svg';
import styles from '../ArticleList/ArticleList.module.scss';
import { fetchDeleteArticle } from '../../store/features/articles/articlesThunks';

const MAX_TITLE_LENGTH = 20;

const splicedText = (text, lengthValue) => {
  let shortenText;
  if (text.length > lengthValue) {
    shortenText = text.split(' ').slice(0, 3);
  }
  return shortenText ? `${shortenText.join(' ')} ...` : text;
};

function Article({ article, isDetailed }) {
  const {
    slug,
    title,
    description,
    body,
    tagList,
    favoritesCount,
    updatedAt,
    author: { username, image },
  } = article;
  const isLogin = useSelector((state) => state.user.isLogin);

  const mdTitle = `## ${title}`;
  const navigator = useNavigate();
  const dispatch = useDispatch();

  const user = localStorage.getItem('user');
  const getUser = JSON.parse(user);

  return (
    <div className={isDetailed ? `${styles.card} ${styles.md}` : styles.card}>
      <div className={styles.article}>
        {isDetailed ? (
          <ReactMarkdown className={`${styles['article-name']} ${styles.md}`}>
            {mdTitle}
          </ReactMarkdown>
        ) : (
          <h2 className={styles['article-name']}>
            <Link to={`/blog/${slug}`}>{splicedText(title, MAX_TITLE_LENGTH)}</Link>
          </h2>
        )}

        <div className={styles.like}>
          <Button disabled>
            <img src={heart} alt="heart-btn" />
          </Button>
          <p>{favoritesCount}</p>
        </div>
      </div>

      <div className={styles.avatar}>
        <div className={styles.about}>
          <p>{username}</p>
          <p>{format(new Date(updatedAt), 'MMMM d, yyyy')} </p>
        </div>
        <div className={styles.photo}>
          <img src={image} alt="avatar" />
        </div>
        {isDetailed && username === getUser?.username && isLogin && (
          <div className={styles.btns}>
            <Popconfirm
              placement="right"
              title="Are you sure to delete this task?"
              description="Delete the task"
              onConfirm={() =>
                dispatch(fetchDeleteArticle({ token: getUser?.token, slug })).then(() =>
                  navigator('/')
                )
              }
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger className={`${styles.btn} ${styles.delete}`}>
                Delete
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              className={`${styles.btn} ${styles.edit}`}
              onClick={() => navigator(`/articles/${slug}/edit`)}
            >
              Edit
            </Button>
          </div>
        )}
      </div>

      <div className={styles.tag}>
        {tagList.map((tag) => (
          <Tag key={nanoid()}>{tag}</Tag>
        ))}
      </div>

      <p className={isDetailed ? `${styles.description} ${styles.md}` : styles.description}>
        {description}
      </p>
      {isDetailed && <ReactMarkdown className={styles.body}>{body}</ReactMarkdown>}
    </div>
  );
}

Article.defaultProps = {
  isDetailed: false,
};

export default Article;
