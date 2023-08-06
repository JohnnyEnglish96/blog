import React from 'react';
import { Button } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from '../App/App.module.scss';
import avatar from '../../assets/img/avatar.jpg';

function Layout() {
  return (
    <div className={styles.App}>
      <Header />
      <Outlet />
    </div>
  );
}

function Header() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const userName = useSelector((state) => state.user.details?.user?.username);
  const iconURL = useSelector((state) => state.user.details?.user?.image);
  const icon = (
    <div className={styles.icon}>
      <img src={iconURL || avatar} alt="icon" style={{ width: '100%' }} />
    </div>
  );
  let buttons;
  buttons = (
    <li className={styles['sign-buttons']}>
      <Link to="/sign-in">
        <Button type="text">Sign In</Button>
      </Link>

      <Link to="/sign-up">
        <Button>Sign Up</Button>
      </Link>
    </li>
  );

  if (isLogin) {
    buttons = (
      <li className={styles['sign-buttons']}>
        <Button type="text">Create article</Button>
        <Link to="/profile">
          <div className={styles['avatar-wrapper']}>
            {userName}
            {icon}
          </div>
        </Link>
        <Button>Log Out</Button>
      </li>
    );
  }
  return (
    <ul className={styles.header}>
      <li>
        <Link to="/" style={{ fontWeight: 400, fontSize: 18, textAlign: 'center', color: 'black' }}>
          Realworld Blog
        </Link>
      </li>

      {buttons}
    </ul>
  );
}

export default Layout;
