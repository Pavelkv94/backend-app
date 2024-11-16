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

export type ConfirmationInputModel = {
  code: string;
};

export type EmailResendInputModel = {
  email: string;
};

export type JwtTokensType = {
  accessToken: string;
  refreshToken: string;
};

export type AdditionalQueryInputModel = {
  user: { id: string; deviceId: string };
};

export type RecoveryPasswordInputModel = {
  newPassword: string;
  recoveryCode: string;
};
