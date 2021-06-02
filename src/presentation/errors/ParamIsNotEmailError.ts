export class ParamIsNotEmailError extends Error {
  constructor(email: string) {
    super(`Param is not a e-mail: ${email}`);
    this.name = `ParamIsNotEmailError: ${email}`;
  }
}
