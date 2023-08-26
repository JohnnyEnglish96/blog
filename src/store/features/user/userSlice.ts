import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import { IUserInitialState } from '../../../components/models/IUser';

import { fetchNewUser, fetchLoginUser, fetchEditUser, LogOut, fetchGetUser } from './userThunks';

const user = localStorage.getItem('user');

const initialState: IUserInitialState = {
  details: null,
  loading: false,
  error: undefined,
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
      state.error = undefined;
    },
    clearRegister(state) {
      state.isRegistered = false;
      state.details = null;
      localStorage.removeItem('defaultUser');
    },
    toLogin(state) {
      localStorage.removeItem('defaultUser');
      localStorage.removeItem('logoutEvent');
      state.isLogin = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          fetchNewUser.pending,
          fetchLoginUser.pending,
          fetchEditUser.pending,
          fetchGetUser.pending,
          LogOut.pending
        ),
        (state, action) => {
          const { type } = action;
          if (type === LogOut.pending.type) {
            localStorage.removeItem('loginEvent');
            localStorage.setItem('logoutEvent', 'logoutEvent');
            state.isLogin = false;
          }
          state.loading = true;
          state.error = undefined;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchNewUser.fulfilled,
          fetchLoginUser.fulfilled,
          fetchEditUser.fulfilled,
          fetchGetUser.fulfilled,
          LogOut.fulfilled
        ),
        (state, action) => {
          const { type, payload } = action;
          if (type === fetchLoginUser.fulfilled.type && payload?.user) {
            localStorage.removeItem('defaultUser');
            state.isLogin = true;
            localStorage.setItem('loginEvent', 'loginEvent');
            localStorage.setItem('user', JSON.stringify(payload.user));
          } else if (type === fetchEditUser.fulfilled.type && payload?.user) {
            localStorage.removeItem('defaultUser');
            localStorage.setItem('user', JSON.stringify(payload.user));
            state.edited = true;
          } else if (type === fetchNewUser.fulfilled.type && payload?.user) {
            localStorage.removeItem('defaultUser');
            state.isRegistered = true;
          } else if (type === fetchGetUser.fulfilled.type) {
            localStorage.setItem('user', JSON.stringify(payload?.user));
          }
          state.loading = false;
          state.details = payload;
        }
      )
      .addMatcher(
        isAnyOf(fetchNewUser.rejected, fetchLoginUser.rejected, fetchEditUser.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload as '403' | '404' | '500';
        }
      );
  },
});

export const { clearHache, clearEdited, clearRegister, toLogin } = userSlice.actions;
export default userSlice.reducer;
