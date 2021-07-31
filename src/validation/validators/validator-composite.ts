import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { ValidatorError } from '@/validation/errors'

export class ValidationComposite implements Validator {
  constructor (private readonly validators: Validator[]) {}

  validate (value: any): Either<ValidatorError, true> {
    // eslint-disable-next-line no-restricted-syntax
    for (const validator of this.validators) {
      const result = validator.validate(value)
      if (result.isLeft()) {
        return left(result.value)
      }
    }
    return right(true)
  }
}
