export class MissingsParamsError extends Error {
  constructor(paramsName: string[]) {
    super(`Missing param: ${paramsName}`);
    this.name = `MissingParamError: ${paramsName}`;
  }
}
