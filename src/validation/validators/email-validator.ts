import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { IsNotEmailError, MissingParamError, ValidatorError } from '../errors';

export class EmailValidator implements Validator {
  constructor(private readonly fieldName: string) {}

  validate(value: any): Either<ValidatorError, true> {
    if (!value[this.fieldName])
      return left(new MissingParamError(this.fieldName));

    const emailRegex =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value[this.fieldName])
      ? right(true)
      : left(new IsNotEmailError(this.fieldName, value[this.fieldName]));
  }
}
