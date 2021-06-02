import { Either } from '@/shared/either';
import { ValidatorError } from '@/validator/errors';

export interface Validator {
  validate(value: any): Either<ValidatorError[], true>;
}
