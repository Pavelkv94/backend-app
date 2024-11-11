export type TokenEntityModel = {
  token: string;
};

export type JWTPayloadModel = {
  user_id: string;
  deviceId: string;
  iat: number;
  exp: number;
};
