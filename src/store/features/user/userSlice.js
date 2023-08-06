import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { fetchNewUser, fetchGetUser, fetchEditUser } from './userThunks';

const initialState = {
  details: null,
  loading: false,
  error: null,
  token: null,
  isLogin: false,
  edited: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearHache(state) {
      state.details = null;
    },
    clearEdited(state) {
      state.edited = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(fetchNewUser.pending, fetchGetUser.pending, fetchEditUser.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(fetchNewUser.fulfilled, fetchGetUser.fulfilled, fetchEditUser.fulfilled),
        (state, action) => {
          const { type, payload } = action;
          if (type === fetchGetUser.fulfilled.type && payload?.user) {
            state.isLogin = true;
            localStorage.setItem('user', JSON.stringify(payload.user));
          } else if (type === fetchEditUser.fulfilled.type) {
            state.edited = true;
          }
          state.loading = false;
          state.details = payload;
        }
      )
      .addMatcher(
        isAnyOf(fetchNewUser.rejected, fetchGetUser.rejected, fetchEditUser.rejected),
        (state, action) => {
          state.loading = true;
          state.error = action.payload;
        }
      );
  },
});

export const { clearHache, clearEdited } = userSlice.actions;
export default userSlice.reducer;
