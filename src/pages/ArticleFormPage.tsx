import React from 'react';
import { useParams } from 'react-router-dom';

import ArticleForm from '../components/ArticleForm';

const ArticleFormPage: React.FC = () => {
  const { slug } = useParams();

  const formTitle = slug ? 'Edit article' : 'Create new article';

  return <ArticleForm formTitle={formTitle} />;
};

export default ArticleFormPage;
