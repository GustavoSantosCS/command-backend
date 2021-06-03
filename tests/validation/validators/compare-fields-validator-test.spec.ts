import { Validator } from '@/validation/protocols';
import { CompareFieldsValidator } from '@/validation/validators';
import { MissingParamError, NotEqualFieldsError } from '@/validation/errors';

const nameField1 = 'any1_name';
const nameField2 = 'any2_name';
let sut: Validator;

describe('Test Unit CompareFieldsValidator', () => {
  beforeEach(() => {
    sut = new CompareFieldsValidator(nameField1, nameField2);
  });

  it('should return true if the two fields are equal', () => {
    const bodyTest = {
      [`${nameField1}`]: 'any_value',
      [`${nameField2}`]: 'any_value'
    };

    const result = sut.validate(bodyTest);

    expect(result.isRight()).toBeTruthy();
  });

  it('should return NotEqualFieldsError if the two fields are not equal', () => {
    const bodyTest = {
      [`${nameField1}`]: 'any_value',
      [`${nameField2}`]: 'other_value'
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new NotEqualFieldsError(nameField1, nameField2)
    );
  });

  it('should return MissingParamError if the first is not provider', () => {
    const bodyTest = {
      [`${nameField2}`]: 'any_value'
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new MissingParamError(nameField1));
  });

  it('should return MissingParamError if the secund is not provider', () => {
    const bodyTest = {
      [`${nameField1}`]: 'any_value'
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new MissingParamError(nameField2));
  });
});
