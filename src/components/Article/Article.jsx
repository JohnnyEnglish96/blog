/* eslint-disable no-debugger */
import React from 'react';
import { Tag, Button } from 'antd';
import { format } from 'date-fns';
import { nanoid } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import heart from '../../assets/img/heart.svg';
import styles from '../ArticleList/ArticleList.module.scss';

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

  const mdTitle = `## ${title}`;

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
