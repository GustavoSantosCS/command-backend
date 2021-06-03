import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validation/protocols';
import { ValidatorError } from '../errors';

export class RequiredFieldValidator implements Validator {
  constructor(private readonly fieldName: string) {}

  validate(value: any): Either<ValidatorError, true> {
    return value[this.fieldName]
      ? right(true)
      : left(new ValidatorError('Valor não Informado', this.fieldName));
  }
}
