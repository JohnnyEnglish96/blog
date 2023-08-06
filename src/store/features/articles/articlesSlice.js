import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { fetchArticleBySlug, fetchArticles } from './articlesThunks';

const initialState = {
  articles: [],
  article: null,
  amount: 0,
  pageNum: 1,
  loading: false,
  error: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(fetchArticleBySlug.pending, fetchArticles.pending), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        isAnyOf(fetchArticleBySlug.fulfilled, fetchArticles.fulfilled),
        (state, action) => {
          state.loading = false;
          const { type, payload, meta } = action;
          if (type === fetchArticleBySlug.fulfilled.type) {
            state.article = payload.article;
          } else if (type === fetchArticles.fulfilled.type) {
            state.articles = payload.articles;
            state.amount = payload.articlesCount;
            state.pageNum = meta.arg;
          }
        }
      )
      .addMatcher(isAnyOf(fetchArticleBySlug.rejected, fetchArticles.rejected), (state, action) => {
        state.loading = true;
        state.error = action.payload;
      });
  },
});

export default articlesSlice.reducer;
