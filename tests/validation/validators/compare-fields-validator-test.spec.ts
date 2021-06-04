import faker from 'faker';
import { Validator } from '@/validation/protocols';
import { CompareFieldsValidator } from '@/validation/validators';
import { NotEqualFieldsError } from '@/validation/errors';

let fieldLabel1: string;
let fieldLabel2: string;

let sut: Validator;

describe('Test Unit CompareFieldsValidator', () => {
  beforeEach(() => {
    fieldLabel1 = faker.database.column();
    fieldLabel2 = faker.database.column();
    sut = new CompareFieldsValidator(fieldLabel1, fieldLabel2);
  });

  it('should return true if the two fields are equal', () => {
    const equalValue = faker.random.word();
    const bodyTest = {
      [fieldLabel1]: equalValue,
      [fieldLabel2]: equalValue
    };

    const result = sut.validate(bodyTest);

    expect(result.isRight()).toBeTruthy();
  });

  it('should return NotEqualFieldsError if the two fields are not equal', () => {
    const bodyTest = {
      [fieldLabel1]: faker.random.word(),
      [fieldLabel2]: faker.random.word()
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new NotEqualFieldsError(bodyTest[fieldLabel1], bodyTest[fieldLabel2])
    );
  });

  it('should return NotEqualFieldsError if the first is not provider', () => {
    const bodyTest = {
      [fieldLabel2]: faker.random.word()
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new NotEqualFieldsError(null, bodyTest[fieldLabel2])
    );
  });

  it('should return NotEqualFieldsError if the secund is not provider', () => {
    const bodyTest = {
      [fieldLabel1]: faker.random.word()
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new NotEqualFieldsError(bodyTest[fieldLabel1], null)
    );
  });
});
