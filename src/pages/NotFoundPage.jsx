import React from 'react';
import { Alert } from 'antd';

import styles from '../components/App/App.module.scss';

function NotFoundPage() {
  return (
    <Alert
      className={styles['not-found-page']}
      message="Error"
      description="Page Not Found 404"
      type="error"
      showIcon
    />
  );
}

export default NotFoundPage;
