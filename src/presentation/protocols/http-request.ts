export interface HttpRequest<T = any> {
  body?: T;
  headers?: any;
  params?: any;
  query?: any;
}
