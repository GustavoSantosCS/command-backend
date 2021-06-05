import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { IsNotNumberError } from '@/validation/errors';

export class NumberValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly customMessage = null
  ) {}

  validate(value: any): Either<IsNotNumberError, true> {
    const numberValue = value[this.fieldName];
    return typeof numberValue === 'number'
      ? right(true)
      : left(
          new IsNotNumberError(
            this.fieldName,
            value[this.fieldName],
            this.customMessage
          )
        );
  }
}
