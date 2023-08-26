import { configureStore } from '@reduxjs/toolkit';

import userSlice from './features/user/userSlice';
import articlesSlice from './features/articles/articlesSlice';

const store = configureStore({
  reducer: {
    articles: articlesSlice,
    user: userSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
