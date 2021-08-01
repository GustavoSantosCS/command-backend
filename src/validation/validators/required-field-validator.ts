import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { MissingParamError } from '@/validation/errors'

export class RequiredFieldValidator implements Validator {
  private readonly fieldName: string
  private readonly customMessage: string

  constructor(fieldName: string, customMessage: string) {
    this.fieldName = fieldName
    this.customMessage = customMessage
  }

  validate(value: any): Either<MissingParamError, true> {
    return value[this.fieldName] !== undefined && value[this.fieldName] !== null
      ? right(true)
      : left(new MissingParamError(this.customMessage, this.fieldName))
  }
}
