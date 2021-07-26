import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { NotEqualFieldsError } from '@/validation/errors';

export class CompareFieldsValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly otherFieldName: string,
    private readonly customMessage: string
  ) {}

  validate(value: any): Either<NotEqualFieldsError, true> {
    return value[this.fieldName] === value[this.otherFieldName]
      ? right(true)
      : left(new NotEqualFieldsError(this.customMessage, this.fieldName));
  }
}
