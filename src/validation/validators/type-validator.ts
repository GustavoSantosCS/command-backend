import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { IsNotTypeError } from '@/validation/errors'

export class TypeValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly customMessage: string,
    private readonly typeTarget: 'string' | 'number' | 'bigint' | 'boolean'
  ) {}

  validate (value: any): Either<IsNotTypeError, true> {
    const numberValue = value[this.fieldName]
    // eslint-disable-next-line valid-typeof
    return typeof numberValue === this.typeTarget
      ? right(true)
      : left(new IsNotTypeError(this.customMessage, this.fieldName))
  }
}
