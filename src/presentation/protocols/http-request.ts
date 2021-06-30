export interface HttpRequest<T = any, P = any> {
  body?: T;
  headers?: any;
  params?: P;
  query?: any;
}
