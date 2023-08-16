import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'https://blog.kata.academy/api/articles/';

const createRequestOption = (token, method, bodyParams = {}) => {
  const defaultHeaders = {
    Authorization: `Token ${token}`,
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
  };

  return {
    method,
    headers: defaultHeaders,
    ...bodyParams,
  };
};

const createRequestWithBodyOption = (body, method) => {
  const { token } = JSON.parse(localStorage.getItem('user'));
  const { Title, description, tagList, Body } = body;

  const fixedTagList = tagList.map((tag) => tag.trim());

  const bodyInfo = {
    article: {
      title: Title.trim(),
      description: description.trim(),
      body: Body.trim(),
      tagList: fixedTagList,
    },
  };

  return createRequestOption(token, method, { body: JSON.stringify(bodyInfo) });
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

const fetchArticleBySlug = createAsyncThunkWithFetch(
  'article/fetchArticleBySlug',
  async ({ slug, token }) => {
    const url = `${baseUrl}${slug}`;
    const options = createRequestOption(token, 'GET');
    return fetchData(url, options);
  }
);

const fetchArticles = createAsyncThunkWithFetch('articles/fetchArticles', async ({ id, token }) => {
  const offset = id === 1 ? 0 : id * 5 - 5;
  const url = `${baseUrl}?limit=5&offset=${offset}`;
  const options = createRequestOption(token, 'GET');
  return fetchData(url, options);
});

const fetchNewArticle = createAsyncThunkWithFetch('articles/fetchNewArticle', async (body) => {
  const url = `${baseUrl}`;
  const options = createRequestWithBodyOption(body, 'POST');
  return fetchData(url, options);
});

const fetchUpdateArticle = createAsyncThunkWithFetch(
  'articles/fetchUpdateArticle',
  async (body) => {
    const { slug } = body;
    const url = `${baseUrl}${slug}`;
    const options = createRequestWithBodyOption(body, 'PUT');
    return fetchData(url, options);
  }
);

const fetchDeleteArticle = createAsyncThunkWithFetch(
  'articles/fetchDeleteArticle',
  async (articleData) => {
    const { slug, token } = articleData;
    const url = `${baseUrl}${slug}`;
    const options = createRequestOption(token, 'DELETE');
    return fetchData(url, options);
  }
);

const fetchPutLike = createAsyncThunkWithFetch('articles/fetchPutLike', async (articleData) => {
  const { slug, token } = articleData;
  const url = `${baseUrl}${slug}/favorite`;
  const options = createRequestOption(token, 'POST');
  return fetchData(url, options);
});

const fetchPutDisLike = createAsyncThunkWithFetch(
  'articles/fetchPutDisLike',
  async (articleData) => {
    const { slug, token } = articleData;
    const url = `${baseUrl}${slug}/favorite`;
    const options = createRequestOption(token, 'DELETE');
    return fetchData(url, options);
  }
);

export {
  fetchArticleBySlug,
  fetchArticles,
  fetchNewArticle,
  fetchUpdateArticle,
  fetchDeleteArticle,
  fetchPutLike,
  fetchPutDisLike,
};
