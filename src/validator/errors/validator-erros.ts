export class ValidatorError extends Error {
  value: any;

  constructor(message: string, value: any) {
    super(message);
    this.value = value;
  }
}
