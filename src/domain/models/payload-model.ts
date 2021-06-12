export type PayloadModel<T = any> = {
  body: T;
  iat: number;
  exp: number;
};
