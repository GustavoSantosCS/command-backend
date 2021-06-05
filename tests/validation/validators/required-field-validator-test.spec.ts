import faker from 'faker';
import { RequiredFieldValidator } from '@/validation/validators';
import { MissingParamError } from '@/validation/errors';

let fieldLabel: string;

let customMessage: string;
const makeSut = (messageValidator = null): { sut: RequiredFieldValidator } => ({
  sut: messageValidator
    ? new RequiredFieldValidator(fieldLabel, messageValidator)
    : new RequiredFieldValidator(fieldLabel)
});
describe('Test Unit RequiredFieldValidator', () => {
  beforeEach(() => {
    fieldLabel = faker.database.column();
    customMessage = faker.random.words(5);
  });

  it('should return true if value is provider', () => {
    const { sut } = makeSut();
    const result = sut.validate({ [fieldLabel]: faker.random.word() });

    expect(result.isRight()).toBeTruthy();
  });

  it('should return MissingParamError if value is not provider', () => {
    const { sut } = makeSut();
    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new MissingParamError(fieldLabel));
  });

  it('should return to custom Message if this is provisioned', () => {
    const { sut } = makeSut(customMessage);
    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new MissingParamError(fieldLabel, customMessage)
    );
  });
});
