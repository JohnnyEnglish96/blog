import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  fetchArticleBySlug,
  fetchArticles,
  fetchNewArticle,
  fetchUpdateArticle,
  fetchDeleteArticle,
} from './articlesThunks';

const initialState = {
  articles: [],
  article: null,
  amount: 0,
  pageNum: 1,
  loading: false,
  error: null,
  complited: false,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          fetchArticleBySlug.pending,
          fetchArticles.pending,
          fetchNewArticle.pending,
          fetchUpdateArticle.pending,
          fetchDeleteArticle.pending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchArticleBySlug.fulfilled,
          fetchArticles.fulfilled,
          fetchNewArticle.fulfilled,
          fetchUpdateArticle.fulfilled,
          fetchDeleteArticle.fulfilled
        ),
        (state, action) => {
          state.loading = false;
          const { type, payload, meta } = action;
          if (type === fetchArticleBySlug.fulfilled.type) {
            state.article = payload.article;
          } else if (type === fetchArticles.fulfilled.type) {
            state.complited = false;
            state.articles = payload.articles;
            state.amount = payload.articlesCount;
            state.pageNum = meta.arg;
          } else if (
            type === fetchNewArticle.fulfilled.type ||
            type === fetchUpdateArticle.fulfilled.type ||
            type === fetchDeleteArticle.fulfilled.type
          ) {
            state.complited = true;
          }
        }
      )
      .addMatcher(
        isAnyOf(
          fetchArticleBySlug.rejected,
          fetchArticles.rejected,
          fetchUpdateArticle.rejected,
          fetchDeleteArticle.rejected
        ),
        (state, action) => {
          state.loading = true;
          state.error = action.payload;
        }
      );
  },
});

export default articlesSlice.reducer;
