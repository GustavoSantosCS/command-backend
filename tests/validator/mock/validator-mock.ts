import { Either, right } from '@/shared/either';
import { Validator } from '@/validator/protocols';
import { ValidatorError } from '@/validator/errors';

class ValidatorMock implements Validator {
  validate(value: any): Either<ValidatorError[], true> {
    return right(true);
  }
}

export const makeMockValidator = (): Validator => new ValidatorMock();
