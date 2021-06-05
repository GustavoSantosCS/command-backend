import { Validator } from '@/validation/protocols';
import {
  RequiredFieldValidator,
  EmailValidator,
  CompareFieldsValidator
} from '@/validation/validators';

export class ValidatorBuilder {
  private constructor(
    private readonly fieldName: string,
    private readonly validators: Validator[]
  ) {}

  static field(fieldName: string): ValidatorBuilder {
    return new ValidatorBuilder(fieldName, []);
  }

  required(customMessage?: string): ValidatorBuilder {
    this.validators.push(
      new RequiredFieldValidator(this.fieldName, customMessage)
    );
    return this;
  }

  email(customMessage?: string): ValidatorBuilder {
    this.validators.push(new EmailValidator(this.fieldName, customMessage));
    return this;
  }

  toEqual(otherFieldName: string, customMessage?: string): ValidatorBuilder {
    console.log(customMessage);
    this.validators.push(
      new CompareFieldsValidator(this.fieldName, otherFieldName, customMessage)
    );
    return this;
  }

  build(): Validator[] {
    return this.validators;
  }
}
