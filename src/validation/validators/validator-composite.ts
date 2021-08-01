import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { ValidatorError } from '@/validation/errors'

export class ValidationComposite implements Validator {
  private readonly validators: Validator[]

  constructor(validators: Validator[]) {
    this.validators = validators
  }

  validate(value: any): Either<ValidatorError, true> {
    for (const validator of this.validators) {
      const result = validator.validate(value)
      if (result.isLeft()) {
        return left(result.value)
      }
    }
    return right(true)
  }
}
