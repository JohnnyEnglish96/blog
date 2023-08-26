import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { IArticleState } from '../../../components/models/IArticle';

import {
  fetchArticleBySlug,
  fetchArticles,
  fetchNewArticle,
  fetchUpdateArticle,
  fetchDeleteArticle,
  fetchPutLike,
  fetchPutDisLike,
} from './articlesThunks';

const defaultPageNum = JSON.parse(sessionStorage.getItem('pageNum') || '1');

const initialState: IArticleState = {
  articles: [],
  article: null,
  amount: 0,
  pageNum: defaultPageNum,
  loading: false,
  error: undefined,
  complited: false,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          fetchArticleBySlug.pending,
          fetchArticles.pending,
          fetchNewArticle.pending,
          fetchUpdateArticle.pending,
          fetchDeleteArticle.pending,
          fetchPutLike.pending
        ),
        (state, action) => {
          const { type } = action;
          if (type === fetchPutLike.pending.type || type === fetchPutDisLike.pending.type) {
            state.loading = false;
          } else {
            state.loading = true;
          }
          state.error = undefined;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchArticleBySlug.fulfilled,
          fetchArticles.fulfilled,
          fetchNewArticle.fulfilled,
          fetchUpdateArticle.fulfilled,
          fetchDeleteArticle.fulfilled,
          fetchPutLike.fulfilled
        ),
        (state, action) => {
          state.loading = false;
          const { type, payload, meta } = action;
          if (type === fetchArticleBySlug.fulfilled.type) {
            state.article = payload.article ?? null;
          } else if (type === fetchArticles.fulfilled.type) {
            state.complited = false;
            state.articles = payload.articles ?? [];
            state.amount = payload.articlesCount ?? 0;
            state.pageNum = meta.arg.id;
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
          fetchDeleteArticle.rejected,
          fetchPutLike.rejected,
          fetchPutDisLike.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as '403' | '404' | '500';
        }
      );
  },
});

export default articlesSlice.reducer;
