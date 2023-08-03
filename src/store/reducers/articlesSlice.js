import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'https://blog.kata.academy/api/articles/';

const initialState = {
  articles: [],
  amount: 0,
  pageNum: 1,
  loading: false,
  error: null,
};

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

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.loading = false;
      state.articles = action.payload.articles;
      state.amount = action.payload.articlesCount;
      state.pageNum = action.meta.arg;
    });

    builder.addCase(fetchArticles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export { fetchArticles };

export default articlesSlice.reducer;
