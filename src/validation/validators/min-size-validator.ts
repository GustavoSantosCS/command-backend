import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { MinimumSizeError } from '@/validation/errors'

export class MinimumSizeValidator implements Validator {
  private readonly fieldName: string
  private readonly minimumSize: number
  private readonly customMessage: string

  constructor(fieldName: string, minimumSize: number, customMessage: string) {
    this.fieldName = fieldName
    this.minimumSize = minimumSize
    this.customMessage = customMessage
  }

  validate(value: any): Either<MinimumSizeError, true> {
    const fieldValue: string = value[this.fieldName]
    return fieldValue?.length >= this.minimumSize
      ? right(true)
      : left(new MinimumSizeError(this.customMessage, this.fieldName))
  }
}
