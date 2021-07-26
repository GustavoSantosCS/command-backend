import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { InvalidParamError } from '@/validation/errors';

export class BelongsToArrayValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly array: any[],
    private readonly customMessage: string
  ) {}

  validate(value: any): Either<InvalidParamError, true> {
    const fieldValue: string = value[this.fieldName];

    return this.array.includes(fieldValue)
      ? right(true)
      : left(new InvalidParamError(this.customMessage, this.fieldName));
  }
}
