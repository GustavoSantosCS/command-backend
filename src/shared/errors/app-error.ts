export class AppError extends Error {
  data: {};
  constructor(message: string, data?: {}, stack?: string) {
    super(message);
    this.message = message;
    this.data = data;
    this.stack = stack;
  }
}
