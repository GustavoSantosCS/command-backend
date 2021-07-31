import faker from 'faker';
import { EmailValidator } from '@/validation/validators';
import { IsNotEmailError } from '@/validation/errors';

let fieldLabel: string;
let message: string;
const makeSut = (
  messageValidator?: string
): { sut: EmailValidator; validateMessage: string } => ({
  sut: new EmailValidator(fieldLabel, messageValidator || message),
  validateMessage: messageValidator || message
});

describe('Test Unit EmailValidator', () => {
  beforeEach(() => {
    fieldLabel = faker.database.column();
    message = faker.random.words(5);
  });

  test('Should return error if email is invalid', () => {
    const { sut } = makeSut();
    const fieldValue = faker.random.word();

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new IsNotEmailError(message, fieldLabel));
  });

  test('Should return true if email is valid', () => {
    const { sut } = makeSut();
    const fieldValue = faker.internet.email();

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isRight()).toBeTruthy();
  });

  test('Should return falsy if email is empty', () => {
    const { sut } = makeSut();
    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new IsNotEmailError(message, fieldLabel));
  });

  test('Should return the customMessage if have error', () => {
    const { sut, validateMessage } = makeSut(`${message} custom`);
    const fieldValue = faker.random.word();

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new IsNotEmailError(validateMessage, fieldLabel)
    );
  });
});
