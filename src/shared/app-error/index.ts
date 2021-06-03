export class AppError extends Error {
  value: any;

  constructor(message: string, value?: any, stack?: string) {
    super(message);
    this.value = value;
    this.stack = stack;
  }
}
