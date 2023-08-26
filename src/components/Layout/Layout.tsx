import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from '../App/App.module.scss';
import Header from '../Header';

const Layout: React.FC = () => {
  return (
    <div className={styles.App}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
