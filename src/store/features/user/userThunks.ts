/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { IUserFetch } from '../../../components/models/IUser';

const baseUrl = 'https://blog.kata.academy/api/';

interface IRequestOption {
  method: string;
  headers: {
    [key: string]: string;
  };
  bodyParams?: {
    body: string;
  };
}

interface IBody {
  Avatar?: string;
  Email?: string;
  Password?: string;
  Username?: string;
}

interface IFethFn {
  (args: IBody): Promise<IUserFetch>;
}

interface IError {
  message: '403' | '404' | '500';
}

const createRequestOption = (method: string, bodyParams = {}): IRequestOption => {
  const { token } = JSON.parse(localStorage.getItem('user') as string) || {};

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

const createPutMethod = (newUserData: IBody): IRequestOption => {
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

const createPostMethod = (userData: IBody, newUser: boolean): IRequestOption => {
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

const createAsyncThunkWithFetch = (name: string, fetchFunction: IFethFn) => {
  return createAsyncThunk<IUserFetch, IBody, { rejectValue: '403' | '404' | '500' }>(
    name,
    async (args, { rejectWithValue }) => {
      try {
        const data = fetchFunction(args);
        return data;
      } catch (e) {
        const error = e as IError;
        return rejectWithValue(error.message);
      }
    }
  );
};

const fetchData = async (url: string, options: IRequestOption) => {
  const response = await fetch(url, options);
  if (!response.ok && response.status !== 422) {
    throw new Error(response.status.toString());
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
  return new Promise<null>((resolve) => {
    localStorage.removeItem('user');
    setTimeout(() => resolve(null), 500);
  });
});

export { fetchLoginUser, fetchNewUser, fetchEditUser, LogOut, fetchGetUser };
