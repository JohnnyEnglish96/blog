import React, { useEffect, useState } from 'react';
import { Tag, Button, Popconfirm } from 'antd';
import { format } from 'date-fns';
import { nanoid } from '@reduxjs/toolkit';
import { Link, useNavigate } from 'react-router-dom';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';

import styles from '../ArticleList/ArticleList.module.scss';
import {
  fetchDeleteArticle,
  fetchPutLike,
  fetchPutDisLike,
} from '../../store/features/articles/articlesThunks';

const MAX_TITLE_LENGTH = 30;
const MAX_TAG_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 50;

const splicedText = (text, lengthValue) => {
  let shortenText;
  if (text.length > lengthValue) {
    shortenText = text.split('').slice(0, lengthValue);
  }
  return shortenText ? `${shortenText.join('')} ...` : text;
};

function Article({ article, isDetailed }) {
  const {
    slug,
    title,
    description,
    body,
    tagList,
    favorited,
    favoritesCount,
    updatedAt,
    author: { username, image },
  } = article;
  const [likedCount, setLikedCount] = useState(favoritesCount);
  const [likeTrigger, setLikeTrigger] = useState(favorited ? 'favorited' : null);
  const isLogin = useSelector((state) => state.user.isLogin);

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const user = localStorage.getItem('user');
  const getUser = JSON.parse(user);

  useEffect(() => {
    if (likeTrigger === null) return;

    if (likeTrigger && likeTrigger !== 'favorited') {
      dispatch(fetchPutLike({ token: getUser?.token, slug }));
      setLikedCount((prev) => prev + 1);
    } else if (!likeTrigger) {
      dispatch(fetchPutDisLike({ token: getUser?.token, slug }));
      setLikedCount((prev) => prev - 1);
    }
  }, [dispatch, getUser?.token, likeTrigger, slug]);

  return (
    <div className={isDetailed ? `${styles.card} ${styles.md}` : styles.card}>
      <div className={styles.article}>
        {isDetailed ? (
          <h2 className={styles['article-name']}>{splicedText(title, MAX_TITLE_LENGTH + 20)}</h2>
        ) : (
          <h2 className={styles['article-name']}>
            <Link to={`/blog/${slug}`}>{splicedText(title, MAX_TITLE_LENGTH)}</Link>
          </h2>
        )}

        <div className={styles.like}>
          <Button
            disabled={!isLogin}
            className={styles['heart-btn']}
            onClick={() => setLikeTrigger((prev) => !prev)}
          >
            {likeTrigger ? <HeartFilled style={{ color: '#FF0707' }} /> : <HeartOutlined />}
          </Button>
          <p>{likedCount}</p>
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
          <Tag key={nanoid()}>{splicedText(tag, MAX_TAG_LENGTH)}</Tag>
        ))}
      </div>

      <p className={isDetailed ? `${styles.description} ${styles.md}` : styles.description}>
        {isDetailed ? description : splicedText(description, MAX_DESCRIPTION_LENGTH)}
      </p>
      {isDetailed && <ReactMarkdown className={styles.body}>{body}</ReactMarkdown>}
    </div>
  );
}

Article.defaultProps = {
  isDetailed: false,
};

export default Article;
