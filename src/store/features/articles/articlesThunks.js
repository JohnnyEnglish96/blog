import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = 'https://blog.kata.academy/api/articles/';

const getOption = (token) => {
  return {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
  };
};

const postOption = (body) => {
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

  return {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(bodyInfo),
  };
};

const putOption = (body) => {
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

const deleteOption = (token) => {
  return {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
  };
};

const postLikeOption = (token) => {
  return {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      accept: 'application/json',
      'Content-Type': 'application/json;charset=utf-8',
    },
  };
};

const fetchArticleBySlug = createAsyncThunk(
  'article/fetchArticleBySlug',
  async ({ slug, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}${slug}`, getOption(token));
      if (!response.ok && response.status !== 422) {
        throw new Error(response.status);
      }
      const data = response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const offset = id === 1 ? 0 : id * 5 - 5;
      const response = await fetch(`${baseUrl}?limit=5&offset=${offset}`, getOption(token));
      if (!response.ok && response.status !== 422) {
        throw new Error(response.status);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchNewArticle = createAsyncThunk(
  'articles/fetchNewArticle',
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}`, postOption(body));
      if (!response.ok && response.status !== 422) {
        throw new Error(response.status);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchUpdateArticle = createAsyncThunk(
  'articles/fetchUpdateArticle',
  async (body, { rejectWithValue }) => {
    const { slug } = body;
    try {
      const response = await fetch(`${baseUrl}${slug}`, putOption(body));
      if (!response.ok && response.status !== 422) {
        throw new Error(response.status);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchDeleteArticle = createAsyncThunk(
  'articles/fetchDeleteArticle',
  async (articleData, { rejectWithValue }) => {
    const { slug, token } = articleData;
    try {
      const response = await fetch(`${baseUrl}${slug}`, deleteOption(token));
      if (!response.ok && response.status !== 422) {
        throw new Error(response.status);
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchPutLike = createAsyncThunk(
  'articles/fetchPutLike',
  async (articleData, { rejectWithValue }) => {
    const { slug, token } = articleData;
    try {
      const response = await fetch(`${baseUrl}${slug}/favorite`, postLikeOption(token));
      if (!response.ok && response.status !== 422) {
        throw new Error(response.status);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchPutDisLike = createAsyncThunk(
  'articles/fetchPutDisLike',
  async (articleData, { rejectWithValue }) => {
    const { slug, token } = articleData;
    try {
      const response = await fetch(`${baseUrl}${slug}/favorite`, deleteOption(token));
      if (!response.ok && response.status !== 422) {
        throw new Error(response.status);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
