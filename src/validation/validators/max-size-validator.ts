import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { MinimumSizeError } from '@/validation/errors'

export class MaxSizeValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly maxSize: number,
    private readonly customMessage: string
  ) {}

  validate (value: any): Either<MinimumSizeError, true> {
    const fieldValue: string = value[this.fieldName]
    return fieldValue?.length <= this.maxSize
      ? right(true)
      : left(new MinimumSizeError(this.customMessage, this.fieldName))
  }
}
