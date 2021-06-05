import faker from 'faker';
import { NumberValidator } from '@/validation/validators';
import { IsNotNumberError } from '@/validation/errors';

let fieldLabel: string;
let message: string;
const makeSut = (messageValidator = null): { sut: NumberValidator } => ({
  sut: new NumberValidator(fieldLabel, messageValidator)
});

describe('Test Unit NumberValidator', () => {
  beforeEach(() => {
    fieldLabel = faker.database.column();
    message = faker.random.words(5);
  });

  test('should return error if number is invalid', () => {
    const { sut } = makeSut();
    const fieldValue = faker.random.word();

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new IsNotNumberError(fieldLabel, fieldValue));
  });

  test('should return true if number is valid', () => {
    const { sut } = makeSut();
    const fieldValue = faker.datatype.number();

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isRight()).toBeTruthy();
  });

  test('should return falsy if number is empty', () => {
    const { sut } = makeSut();
    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new IsNotNumberError(fieldLabel, null));
  });

  test('should return the customMessage if have error', () => {
    const { sut } = makeSut(message);

    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new IsNotNumberError(fieldLabel, null, message)
    );
  });
});
