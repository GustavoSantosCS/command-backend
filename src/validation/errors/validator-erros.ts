export class ValidatorError extends Error {
  value: any;
  field: string;
  constructor(message: string, value?: any, field?: any) {
    super(message);
    this.value = value;
    this.field = field;
  }
}
