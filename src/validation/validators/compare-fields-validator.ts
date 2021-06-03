import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { MissingParamError, ValidatorError } from '../errors';
import { NotEqualFieldsError } from '../errors/not-equal-fields-error';

export class CompareFieldsValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly otherFieldName: string
  ) {}

  validate(value: any): Either<ValidatorError, true> {
    if (!value[this.fieldName])
      return left(new MissingParamError(this.fieldName));

    if (!value[this.otherFieldName])
      return left(new MissingParamError(this.otherFieldName));

    return value[this.fieldName] === value[this.otherFieldName]
      ? right(true)
      : left(new NotEqualFieldsError(this.fieldName, this.otherFieldName));
  }
}
