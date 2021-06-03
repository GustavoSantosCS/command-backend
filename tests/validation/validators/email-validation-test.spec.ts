import faker from 'faker';
import { EmailValidator } from '@/validation/validators';
import { IsNotEmailError } from '@/validation/errors';

let fieldLabel: string;
let sut: EmailValidator;

describe('Test Unit EmailValidator', () => {
  beforeEach(() => {
    fieldLabel = faker.database.column();
    sut = new EmailValidator(fieldLabel);
  });

  test('Should return error if email is invalid', () => {
    const fieldValue = faker.random.word();

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new IsNotEmailError(fieldLabel, fieldValue));
  });

  test('Should return true if email is valid', () => {
    const fieldValue = faker.internet.email();

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isRight()).toBeTruthy();
  });

  test('Should return falsy if email is empty', () => {
    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new IsNotEmailError(fieldLabel, null));
  });
});
