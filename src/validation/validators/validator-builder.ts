import { Validator } from '@/validation/protocols'
import {
  RequiredFieldValidator,
  EmailValidator,
  CompareFieldsValidator,
  MinimumSizeValidator,
  MaxSizeValidator,
  BelongsToArrayValidator,
  TypeValidator,
  IsArrayValidator
} from '@/validation/validators'

export class ValidatorBuilder {
  private constructor (
    private readonly fieldName: string,
    private readonly validators: Validator[]
  ) {}

  static field (fieldName: string): ValidatorBuilder {
    return new ValidatorBuilder(fieldName, [])
  }

  required (customMessage: string): ValidatorBuilder {
    this.validators.push(
      new RequiredFieldValidator(this.fieldName, customMessage)
    )
    return this
  }

  email (customMessage: string): ValidatorBuilder {
    this.validators.push(new EmailValidator(this.fieldName, customMessage))
    return this
  }

  min (minimumSize: number, customMessage: string): ValidatorBuilder {
    this.validators.push(
      new MinimumSizeValidator(this.fieldName, minimumSize, customMessage)
    )
    return this
  }

  max (maxSize: number, customMessage: string): ValidatorBuilder {
    this.validators.push(
      new MaxSizeValidator(this.fieldName, maxSize, customMessage)
    )
    return this
  }

  toEqual (otherFieldName: string, customMessage: string): ValidatorBuilder {
    this.validators.push(
      new CompareFieldsValidator(this.fieldName, otherFieldName, customMessage)
    )
    return this
  }

  belongsTo (array: any[], customMessage: string): ValidatorBuilder {
    this.validators.push(
      new BelongsToArrayValidator(this.fieldName, array, customMessage)
    )
    return this
  }

  isString (customMessage: string): ValidatorBuilder {
    this.validators.push(
      new TypeValidator(this.fieldName, customMessage, 'string')
    )
    return this
  }

  isNumber (customMessage: string): ValidatorBuilder {
    this.validators.push(
      new TypeValidator(this.fieldName, customMessage, 'number')
    )
    return this
  }

  isArray (customMessage: string) {
    this.validators.push(new IsArrayValidator(this.fieldName, customMessage))
    return this
  }

  isBoolean (customMessage: string): ValidatorBuilder {
    this.validators.push(
      new TypeValidator(this.fieldName, customMessage, 'boolean')
    )
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
