import { Either, left, right } from '@/shared/either';
import { Validator } from '@/validator/protocols';
import { ValidatorError } from '@/validator/errors';
import { AppError } from '@/shared/app-error';

type Returns = {
  right: Either<ValidatorError[], true>;
  left: Either<ValidatorError[], true>;
};

export class ValidatorSpy implements Validator {
  returns: Returns = {
    right: right(true),
    left: left([new ValidatorError('any_message', 'any_value')])
  };
  return = this.returns.right;
  parameters: any;
  error: AppError;

  throwsError() {
    this.error = new AppError('any_message', 'any_value');
  }

  validate(value: any): Either<ValidatorError[], true> {
    this.parameters = value;
    if (this.error) throw this.error;
    return this.return;
  }
}