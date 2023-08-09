import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { fetchNewUser, fetchGetUser, fetchEditUser, LogOut } from './userThunks';

const user = localStorage.getItem('user');

const initialState = {
  details: null,
  loading: false,
  error: null,
  token: null,
  isLogin: !!user,
  isRegistered: false,
  edited: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearHache(state) {
      state.details = null;
      localStorage.removeItem('defaultUser');
    },
    clearEdited(state) {
      state.edited = false;
    },
    clearRegister(state) {
      state.isRegistered = false;
      state.details = null;
      localStorage.removeItem('defaultUser');
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(fetchNewUser.pending, fetchGetUser.pending, fetchEditUser.pending, LogOut.pending),
        (state, action) => {
          const { type } = action;
          if (type === LogOut.pending.type) {
            state.isLogin = false;
          }
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchNewUser.fulfilled,
          fetchGetUser.fulfilled,
          fetchEditUser.fulfilled,
          LogOut.fulfilled
        ),
        (state, action) => {
          const { type, payload } = action;
          if (type === fetchGetUser.fulfilled.type && payload?.user) {
            localStorage.removeItem('defaultUser');
            state.isLogin = true;
            localStorage.setItem('user', JSON.stringify(payload.user));
          } else if (type === fetchEditUser.fulfilled.type && payload?.user) {
            localStorage.removeItem('defaultUser');
            localStorage.setItem('user', JSON.stringify(payload.user));
            state.edited = true;
          } else if (type === fetchNewUser.fulfilled.type && payload?.user) {
            localStorage.removeItem('defaultUser');
            state.isRegistered = true;
          }
          state.loading = false;
          state.details = payload;
        }
      )
      .addMatcher(
        isAnyOf(fetchNewUser.rejected, fetchGetUser.rejected, fetchEditUser.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearHache, clearEdited, clearRegister } = userSlice.actions;
export default userSlice.reducer;
