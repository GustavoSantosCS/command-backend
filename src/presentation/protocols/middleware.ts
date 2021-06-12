export interface Middleware<T = any> {
  handle: (httpRequest: T) => Promise<MiddlewareReturn>;
}

export type MiddlewareReturn = {
  body?: any;
  statusCode: number;
};
