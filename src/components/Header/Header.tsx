import React, { useCallback, useEffect, useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import { Link } from 'react-router-dom';

import { LogOut, fetchGetUser } from '../../store/features/user/userThunks';
import styles from '../App/App.module.scss';
import avatar from '../../assets/img/avatar.jpg';
import { toLogin } from '../../store/features/user/userSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { IUserLocalState } from '../models/IUser';
import { useAppSelector } from '../../hooks/useAppSelector';

const Header: React.FC = () => {
  const [updatedUser, setUpdatedUser] = useState<IUserLocalState | null>(null);
  const isLogin = useAppSelector((state) => state.user.isLogin);
  const edited = useAppSelector((state) => state.user.edited);

  const user = localStorage.getItem('user') as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLogin) {
      setUpdatedUser(null);
    } else if (isLogin || edited) {
      dispatch(fetchGetUser({}));
      setUpdatedUser(JSON.parse(user));
    }
  }, [edited, user, isLogin, dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(LogOut());
  }, [dispatch]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.newValue === 'loginEvent') {
        dispatch(toLogin());
      } else if (e.newValue === 'logoutEvent') {
        handleLogout();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  }, [dispatch, handleLogout]);

  const icon = (
    <div className={styles.icon}>
      <img
        src={updatedUser?.image || avatar}
        alt="icon"
        style={{ width: '100%' }}
        onError={(e: React.FormEvent<HTMLImageElement>) => {
          const imgElement = e.target as HTMLImageElement;
          imgElement.src = avatar;
        }}
      />
    </div>
  );

  const renderAuthenticatedButtons = (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryHover: 'green',
          colorPrimaryActive: 'green',
        },
      }}
    >
      <li className={styles['sign-buttons']}>
        <Link to="new-article">
          <Button type="primary" className={styles['create-btn']}>
            Create article
          </Button>
        </Link>

        <Link to="/profile">
          <div className={styles['avatar-wrapper']}>
            {updatedUser?.username}
            {icon}
          </div>
        </Link>
        <ConfigProvider
          theme={{
            inherit: false,
            token: {
              colorPrimaryHover: 'grey',
              colorPrimaryActive: 'grey',
            },
          }}
        >
          <Button className={styles['log-out-btn']} onClick={handleLogout} type="primary">
            Log Out
          </Button>
        </ConfigProvider>
      </li>
    </ConfigProvider>
  );

  const renderGuestButtons = (
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryHover: 'green',
          colorPrimaryActive: 'green',
        },
      }}
    >
      <li className={styles['sign-buttons']}>
        <Link to="/sign-in">
          <ConfigProvider
            theme={{
              inherit: false,
            }}
          >
            <Button className={styles['sign-in-btn']} type="primary" size="large">
              Sign In
            </Button>
          </ConfigProvider>
        </Link>

        <Link to="/sign-up">
          <Button className={styles['sign-up-btn']} type="primary" size="large">
            Sign Up
          </Button>
        </Link>
      </li>
    </ConfigProvider>
  );

  return (
    <ul className={styles.header}>
      <li>
        <Link
          className={styles['header-title']}
          to="/"
          style={{ fontWeight: 400, fontSize: 18, textAlign: 'center', color: 'black' }}
        >
          Realworld Blog
        </Link>
      </li>

      {updatedUser ? renderAuthenticatedButtons : renderGuestButtons}
    </ul>
  );
};

export default Header;
