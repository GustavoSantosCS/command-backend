import { Validator } from '@/validation/protocols';
import { RequiredFieldValidator } from '@/validation/validators';
import { ValidatorError } from '@/validation/errors';

const nameField = 'any_name';
let sut: Validator;

describe('Test Unit RequiredFieldValidator', () => {
  beforeEach(() => {
    sut = new RequiredFieldValidator(nameField);
  });

  it('should return true if value is provider', () => {
    const bodyTest = {
      [`${nameField}`]: 'any_value'
    };

    const result = sut.validate(bodyTest);

    expect(result.isRight()).toBeTruthy();
  });

  it('should return ValidatorError if value is not provider', () => {
    const bodyTest = {};

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new ValidatorError('Valor não Informado', nameField)
    );
  });
});
