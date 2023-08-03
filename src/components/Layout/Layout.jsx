import React from 'react';
import { Button } from 'antd';
import { Outlet, Link } from 'react-router-dom';

import styles from '../App/App.module.scss';

function Layout() {
  return (
    <div className={styles.App}>
      <Header />
      <Outlet />
    </div>
  );
}

function Header() {
  return (
    <ul className={styles.header}>
      <li>
        <Link to="/" style={{ fontWeight: 400, fontSize: 18, textAlign: 'center', color: 'black' }}>
          Realworld Blog
        </Link>
      </li>

      <li className={styles['sign-buttons']}>
        <Button type="text">Sign In</Button>
        <Button>Sign Up</Button>
      </li>
    </ul>
  );
}

export default Layout;
