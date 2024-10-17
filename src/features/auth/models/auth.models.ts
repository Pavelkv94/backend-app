export type LoginInputModel = {
  loginOrEmail: string;
  password: string;
};

export type MeViewModel = {
  email: string;
  login: string;
  userId: string;
};

export type IdType = {
  id: string;
};

export type LoginOutputModel = {
  accessToken: string;
};
