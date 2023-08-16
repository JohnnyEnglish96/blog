import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from '../App/App.module.scss';
import Header from '../Header';

function Layout() {
  return (
    <div className={styles.App}>
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
