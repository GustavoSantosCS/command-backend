export interface HttpResponse<T = any> {
  statusCode: number;
  body?: {
    errors?: { message: string; value: string }[];
  } & T;
}
