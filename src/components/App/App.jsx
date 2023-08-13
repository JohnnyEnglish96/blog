import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from '../Layout';
import NotFoundPage from '../../pages/NotFoundPage';
import HomePage from '../../pages/HomePage';
import ArticlePage from '../../pages/ArticlePage';
import SignUpPage from '../../pages/SignUpPage';
import SignInPage from '../../pages/SignInPage';
import EditProfilePage from '../../pages/EditProfilePage';
import CreateArticle from '../../pages/CreateArticle';
import ChangeArticle from '../../pages/ChangeArticle';
import RequireAuth from '../../hoc/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="blog/:slug" element={<ArticlePage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <EditProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="new-article"
          element={
            <RequireAuth>
              <CreateArticle />
            </RequireAuth>
          }
        />
        <Route
          path="articles/:slug/edit"
          element={
            <RequireAuth>
              <ChangeArticle />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
