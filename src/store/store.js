import { configureStore } from '@reduxjs/toolkit';

import articlesSlice from './reducers/articlesSlice';
import articleDetailsSlice from './reducers/articleDetailsSlice';

const store = configureStore({
  reducer: {
    articles: articlesSlice,
    articleDetail: articleDetailsSlice,
  },
});

export default store;
