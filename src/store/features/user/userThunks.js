import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'https://blog.kata.academy/api/';

const postOption = (userData, newUser) => {
  const { Username, Email, Password } = userData;
  let bodyInfo;
  if (newUser) {
    bodyInfo = {
      user: {
        username: Username,
        email: Email,
        password: Password,
      },
    };
  } else {
    bodyInfo = {
      user: {
        email: Email,
        password: Password,
      },
    };
  }
  return {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(bodyInfo),
  };
};

const putOption = (newUserData) => {
  const { Username, Password, Email, Avatar } = newUserData;
  const { token } = JSON.parse(localStorage.getItem('user'));
  const bodyInfo = {
    user: {
      email: Email,
      username: Username,
      password: Password,
      image: Avatar,
    },
  };

  return {
    method: 'PUT',
    headers: {
      Authorization: `Token ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(bodyInfo),
  };
};

const fetchNewUser = createAsyncThunk(
  'user/fetchNewUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}users/`, postOption(userData, true));
      if (!response.ok && response.status !== 422) {
        throw new Error(`server Error ${response.status}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchGetUser = createAsyncThunk(
  'user/fetchGetUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}users/login`, postOption(userData, false));

      if (!response.ok && response.status !== 422) {
        throw new Error(`server Error ${response.status}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchEditUser = createAsyncThunk(
  'user/fetchEditUser',
  async (newUserData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}user`, putOption(newUserData));

      if (!response.ok && response.status !== 422) {
        throw new Error(`server Error ${response.status}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const LogOut = createAsyncThunk('user/logOut', async () => {
  return new Promise((resolve) => {
    localStorage.removeItem('user');
    setTimeout(() => resolve(null), 500);
  });
});

export { fetchGetUser, fetchNewUser, fetchEditUser, LogOut };
