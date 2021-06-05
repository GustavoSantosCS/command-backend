import faker from 'faker';
import { MinimumSizeValidator } from '@/validation/validators';
import { MinimumSizeError } from '@/validation/errors';

let fieldLabel: string;
let sizeFieldLabel: number;
let message: string;

const makeSut = (messageValidator = null): { sut: MinimumSizeValidator } => ({
  sut: new MinimumSizeValidator(fieldLabel, sizeFieldLabel, messageValidator)
});

const makeWordTheSize = (size: number): string => {
  let word = faker.random.word();

  while (word.length !== size) {
    word = faker.random.word();
  }

  return word;
};

describe('Test Unit MinimumSizeValidator', () => {
  beforeEach(() => {
    fieldLabel = faker.database.column();
    message = faker.random.words(5);
    sizeFieldLabel = fieldLabel.length;
  });

  test('should return error if the word informed has a minus character', () => {
    const { sut } = makeSut();
    const fieldValue = makeWordTheSize(sizeFieldLabel - 1);

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new MinimumSizeError(fieldLabel, sizeFieldLabel)
    );
  });

  test('should return error if the word is not informed', () => {
    const { sut } = makeSut();

    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new MinimumSizeError(fieldLabel, sizeFieldLabel)
    );
  });

  test('should return true if the word informed has the same size', () => {
    const { sut } = makeSut();
    const fieldValue = makeWordTheSize(sizeFieldLabel);

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isRight()).toBeTruthy();
  });

  test('should return true if the word informed has a char more', () => {
    const { sut } = makeSut();
    const fieldValue = makeWordTheSize(sizeFieldLabel + 1);

    const result = sut.validate({ [fieldLabel]: fieldValue });

    expect(result.isRight()).toBeTruthy();
  });

  test('should return to custom message if this is provided', () => {
    const { sut } = makeSut(message);

    const result = sut.validate({ [fieldLabel]: null });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new MinimumSizeError(fieldLabel, sizeFieldLabel, message)
    );
  });
});
