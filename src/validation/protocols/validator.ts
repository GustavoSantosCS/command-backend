import { Either } from '@/shared/either';
import { ValidatorError } from '@/validation/errors';

export interface Validator {
  validate(value: any): Either<ValidatorError, true>;
}
