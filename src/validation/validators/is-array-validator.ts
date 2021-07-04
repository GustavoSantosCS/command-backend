import { Either, left, right } from '@/shared/either';
import { ValidatorError } from '../errors';
import { IsNotArrayError } from '../errors/is-not-array-error';
import { Validator } from '../protocols';

export class IsArrayValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly customMessage = null
  ) {}

  validate(value: any): Either<ValidatorError, true> {
    const fieldValue = value[this.fieldName];

    return Array.isArray(fieldValue)
      ? right(true)
      : left(
          new IsNotArrayError(
            this.fieldName,
            value[this.fieldName],
            this.customMessage
          )
        );
  }
}
