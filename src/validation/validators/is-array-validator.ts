import { Either, left, right } from '@/shared/either'
import { ValidatorError } from '../errors'
import { IsNotArrayError } from '../errors/is-not-array-error'
import { Validator } from '../protocols'

export class IsArrayValidator implements Validator {
  private readonly fieldName: string
  private readonly customMessage: string

  constructor(fieldName: string, customMessage: string) {
    this.fieldName = fieldName
    this.customMessage = customMessage
  }

  validate(value: any): Either<ValidatorError, true> {
    const fieldValue = value[this.fieldName]

    return Array.isArray(fieldValue)
      ? right(true)
      : left(new IsNotArrayError(this.customMessage, this.fieldName))
  }
}
