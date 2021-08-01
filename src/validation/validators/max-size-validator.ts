import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { MinimumSizeError } from '@/validation/errors'

export class MaxSizeValidator implements Validator {
  private readonly fieldName: string
  private readonly maxSize: number
  private readonly customMessage: string

  constructor(fieldName: string, maxSize: number, customMessage: string) {
    this.fieldName = fieldName
    this.maxSize = maxSize
    this.customMessage = customMessage
  }

  validate(value: any): Either<MinimumSizeError, true> {
    const fieldValue: string = value[this.fieldName]
    return fieldValue?.length <= this.maxSize
      ? right(true)
      : left(new MinimumSizeError(this.customMessage, this.fieldName))
  }
}
