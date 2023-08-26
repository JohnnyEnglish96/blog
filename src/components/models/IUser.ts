export interface IUserInitialState {
  details: {
    errors?: {
      email: string;
      username: string;
    };
    user?: {
      username: string;
      email: string;
      token: string;
      image: string;
    };
  } | null;
  loading: boolean;
  error: '403' | '404' | '500' | undefined;
  token: string | null;
  isLogin: boolean;
  isRegistered: boolean;
  edited: boolean;
}

export interface IUserFetch {
  errors?: {
    email: string;
    username: string;
  };
  user?: {
    username: string;
    email: string;
    token: string;
    image: string;
  };
}

export interface IUserLocalState {
  email: string;
  image: string;
  token: string;
  username: string;
}

export interface IUserForm {
  Avatar?: string;
  Email: string;
  Password?: string;
  Username?: string;
  confirmation?: string;
}
