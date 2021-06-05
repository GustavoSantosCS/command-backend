import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { MinimumSizeError } from '@/validation/errors';

export class MinimumSizeValidator implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly minimumSize: number,
    private readonly customMessage = null
  ) {}

  validate(value: any): Either<MinimumSizeError, true> {
    const fieldValue: string = value[this.fieldName];

    return fieldValue?.length >= this.minimumSize
      ? right(true)
      : left(
          new MinimumSizeError(
            this.fieldName,
            this.minimumSize,
            this.customMessage
          )
        );
  }
}
