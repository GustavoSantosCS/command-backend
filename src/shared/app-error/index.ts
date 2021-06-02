export class AppError extends Error {
  value: any;

  constructor(message: string, value?: any) {
    super(message);
    this.value = value;
  }
}
