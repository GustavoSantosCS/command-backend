export interface HttpRequest<B = any, P = any> {
  body?: B
  headers?: any
  params?: P
  query?: any
}
