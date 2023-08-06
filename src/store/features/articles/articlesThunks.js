import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'https://blog.kata.academy/api/articles/';

const fetchArticleBySlug = createAsyncThunk(
  'article/fetchArticleBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}${slug}`);
      if (!response.ok) {
        throw new Error(`unable to get article, ${response.status}`);
      }
      const data = response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (id, { rejectWithValue }) => {
    try {
      const offset = id === 1 ? 0 : id * 5 - 5;
      const response = await fetch(`${baseUrl}?limit=5&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`server Error ${response.status}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export { fetchArticleBySlug, fetchArticles };
