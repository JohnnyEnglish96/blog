import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'https://blog.kata.academy/api/';

const createRequestOption = (method, bodyParams = {}) => {
  const { token } = JSON.parse(localStorage.getItem('user')) || {};

  const auth = method === 'PUT' || method === 'GET' ? { Authorization: `Token ${token}` } : null;
  const defaultHeaders = {
    ...auth,
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  };

  return {
    method,
    headers: defaultHeaders,
    ...bodyParams,
  };
};

const createPutMethod = (newUserData) => {
  const { Username, Password, Email, Avatar } = newUserData;
  const bodyInfo = {
    user: {
      email: Email,
      username: Username,
      password: Password,
      image: Avatar,
    },
  };

  return createRequestOption('PUT', { body: JSON.stringify(bodyInfo) });
};

const createPostMethod = (userData, newUser) => {
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
  return createRequestOption('POST', { body: JSON.stringify(bodyInfo) });
};

const createAsyncThunkWithFetch = (name, fetchFunction) => {
  return createAsyncThunk(name, async (args, { rejectWithValue }) => {
    try {
      const data = fetchFunction(args);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
};

const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok && response.status !== 422) {
    throw new Error(response.status);
  }

  return response.json();
};

const fetchNewUser = createAsyncThunkWithFetch('user/fetchNewUser', async (userData) => {
  const url = `${baseUrl}users/`;
  const options = createPostMethod(userData, true);
  return fetchData(url, options);
});

const fetchLoginUser = createAsyncThunkWithFetch('user/fetchLoginUser', async (userData) => {
  const url = `${baseUrl}users/login`;
  const options = createPostMethod(userData, false);
  return fetchData(url, options);
});

const fetchGetUser = createAsyncThunkWithFetch('user/fetchGetUser', async () => {
  const url = `${baseUrl}user`;
  const options = createRequestOption('GET');
  return fetchData(url, options);
});

const fetchEditUser = createAsyncThunkWithFetch('user/fetchEditUser', async (newUserData) => {
  const url = `${baseUrl}user`;
  const options = createPutMethod(newUserData);
  return fetchData(url, options);
});

const LogOut = createAsyncThunk('user/logOut', async () => {
  return new Promise((resolve) => {
    localStorage.removeItem('user');
    setTimeout(() => resolve(null), 500);
  });
});

export { fetchLoginUser, fetchNewUser, fetchEditUser, LogOut, fetchGetUser };
