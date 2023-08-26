export interface IArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList?: string[];
  favorited: boolean;
  favoritesCount: number;
  updatedAt: string;
  author: { username: string; image: string };
}

export interface IArticleState {
  articles: IArticle[];
  article: IArticle | null;
  amount: number;
  pageNum: number | undefined;
  loading: boolean;
  error: '403' | '404' | '500' | undefined;
  complited: boolean;
}

export type IArticleFetch = IArticleState & {
  articlesCount?: number;
};

export interface IArticleForm {
  Title: string;
  description: string;
  Body: string;
  tagList: {
    name: string;
  }[];
}

export interface IArticleProps {
  article: IArticle;
  isDetailed?: boolean;
}
