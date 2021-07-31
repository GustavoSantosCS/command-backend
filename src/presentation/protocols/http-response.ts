export interface HttpResponse<T = any> {
  statusCode: number
  body?:
  | {
    errors?: Array<{ message: string, value: string }>
  }
  | T
}
