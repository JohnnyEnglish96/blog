import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'https://blog.kata.academy/api/articles/';

const initialState = {
  article: null,
  loading: false,
  error: null,
};

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

const articleDetailsSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticleBySlug.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchArticleBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.article = action.payload.article;
    });

    builder.addCase(fetchArticleBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export { fetchArticleBySlug };

export default articleDetailsSlice.reducer;
