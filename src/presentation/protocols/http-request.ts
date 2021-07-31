export interface HttpRequest<B = null, P = null> {
  body?: B;
  headers?: any;
  params?: P;
  query?: any;
}
