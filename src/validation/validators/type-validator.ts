import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { IsNotTypeError } from '@/validation/errors'

type TypeTargetValidator = 'string' | 'number' | 'bigint' | 'boolean'

export class TypeValidator implements Validator {
  private readonly fieldName: string
  private readonly customMessage: string
  private readonly typeTarget: TypeTargetValidator

  constructor(
    fieldName: string,
    customMessage: string,
    typeTarget: TypeTargetValidator
  ) {
    this.fieldName = fieldName
    this.customMessage = customMessage
    this.typeTarget = typeTarget
  }

  validate(value: any): Either<IsNotTypeError, true> {
    const numberValue = value[this.fieldName]
    // eslint-disable-next-line valid-typeof
    return typeof numberValue === this.typeTarget
      ? right(true)
      : left(new IsNotTypeError(this.customMessage, this.fieldName))
  }
}
