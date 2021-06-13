import { HttpRequest } from './http-request';
import { HttpResponse } from './http-response';

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
