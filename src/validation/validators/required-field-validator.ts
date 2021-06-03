import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { MissingParamError } from '@/validation/errors';

export class RequiredFieldValidator implements Validator {
  constructor(private readonly fieldName: string) {}

  validate(value: any): Either<MissingParamError, true> {
    return value[this.fieldName]
      ? right(true)
      : left(new MissingParamError(this.fieldName));
  }
}
