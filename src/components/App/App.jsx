import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import Layout from '../Layout';
import NotFoundPage from '../../pages/NotFoundPage';
import HomePage from '../../pages/HomePage';
import ArticlePage from '../../pages/ArticlePage';
import { fetchArticles } from '../../store/reducers/articlesSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticles(1));
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
