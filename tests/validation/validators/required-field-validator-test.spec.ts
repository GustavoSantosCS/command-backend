import faker from 'faker';
import { Validator } from '@/validation/protocols';
import { RequiredFieldValidator } from '@/validation/validators';
import { MissingParamError } from '@/validation/errors';

let fieldLabel: string;
let sut: Validator;

describe('Test Unit RequiredFieldValidator', () => {
  beforeEach(() => {
    fieldLabel = faker.database.column();
    sut = new RequiredFieldValidator(fieldLabel);
  });

  it('should return true if value is provider', () => {
    const result = sut.validate({ [fieldLabel]: faker.random.word() });

    expect(result.isRight()).toBeTruthy();
  });

  it('should return MissingParamError if value is not provider', () => {
    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new MissingParamError(fieldLabel));
  });
});
