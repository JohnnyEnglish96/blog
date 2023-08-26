import { createAsyncThunk } from '@reduxjs/toolkit';

import { IArticleFetch } from '../../../components/models/IArticle';

const baseUrl = 'https://blog.kata.academy/api/articles/';

interface IBody {
  Title: string;
  description: string;
  tagList?: string[];
  Body: string;
}

interface IRequestOption {
  method: string;
  headers: {
    [key: string]: string;
  };
  bodyParams?: {
    body: string;
  };
}

interface IFetchOptions {
  id?: number;
  token?: string;
  body?: IBody;
  slug?: string;
}

interface IFethFn {
  (args: IFetchOptions): Promise<IArticleFetch>;
}

const createRequestOption = (token: string, method: string, bodyParams = {}): IRequestOption => {
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

const createRequestWithBodyOption = (body: IBody, method: string): IRequestOption => {
  const { token } = JSON.parse(localStorage.getItem('user') || '');
  const { Title, description, tagList, Body } = body;

  const fixedTagList = (tagList || []).map((tag) => tag.trim());

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

const createAsyncThunkWithFetch = (name: string, fetchFunction: IFethFn) => {
  return createAsyncThunk<IArticleFetch, IFetchOptions, { rejectValue: string }>(
    name,
    async (args, { rejectWithValue }) => {
      try {
        const data = fetchFunction(args);
        return data;
      } catch (e) {
        const error = e as Error;
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

const fetchArticleBySlug = createAsyncThunkWithFetch(
  'article/fetchArticleBySlug',
  async ({ slug, token }) => {
    const url = `${baseUrl}${slug}`;
    const options = createRequestOption(token as string, 'GET');
    return fetchData(url, options);
  }
);

const fetchArticles = createAsyncThunkWithFetch(
  'articles/fetchArticles',
  async ({ id = 1, token }) => {
    const offset = id === 1 ? 0 : id * 5 - 5;
    const url = `${baseUrl}?limit=5&offset=${offset}`;
    const options = createRequestOption(token as string, 'GET');
    return fetchData(url, options);
  }
);

const fetchNewArticle = createAsyncThunkWithFetch('articles/fetchNewArticle', async ({ body }) => {
  const url = `${baseUrl}`;
  const options = createRequestWithBodyOption(body as IBody, 'POST');
  return fetchData(url, options);
});

const fetchUpdateArticle = createAsyncThunkWithFetch(
  'articles/fetchUpdateArticle',
  async ({ body, slug }) => {
    const url = `${baseUrl}${slug}`;
    const options = createRequestWithBodyOption(body as IBody, 'PUT');
    return fetchData(url, options);
  }
);

const fetchDeleteArticle = createAsyncThunkWithFetch(
  'articles/fetchDeleteArticle',
  async (articleData) => {
    const { slug, token } = articleData;
    const url = `${baseUrl}${slug}`;
    const options = createRequestOption(token as string, 'DELETE');
    return fetchData(url, options);
  }
);

const fetchPutLike = createAsyncThunkWithFetch('articles/fetchPutLike', async ({ slug, token }) => {
  const url = `${baseUrl}${slug}/favorite`;
  const options = createRequestOption(token as string, 'POST');
  return fetchData(url, options);
});

const fetchPutDisLike = createAsyncThunkWithFetch(
  'articles/fetchPutDisLike',
  async ({ slug, token }) => {
    const url = `${baseUrl}${slug}/favorite`;
    const options = createRequestOption(token as string, 'DELETE');
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
