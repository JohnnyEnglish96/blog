import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

import styles from '../components/App/App.module.scss';

function NotFoundPage() {
  return (
    <Result
      className={styles.error}
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
}

export default NotFoundPage;
