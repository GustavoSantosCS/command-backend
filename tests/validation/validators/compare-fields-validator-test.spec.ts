import faker from 'faker';
import { Validator } from '@/validation/protocols';
import { CompareFieldsValidator } from '@/validation/validators';
import { NotEqualFieldsError } from '@/validation/errors';

let fieldLabel1: string;
let fieldLabel2: string;

let message: string;

type SutTypes = { sut: Validator };

const makeSut = (messageValidator?: string): SutTypes => {
  const sut = messageValidator
    ? new CompareFieldsValidator(fieldLabel1, fieldLabel2, messageValidator)
    : new CompareFieldsValidator(fieldLabel1, fieldLabel2);
  return { sut };
};

const makeDifferentWord = (word: string): string => {
  let differentWord = word;
  while (word === differentWord) {
    differentWord = faker.random.word();
  }

  return differentWord;
};

describe('Test Unit CompareFieldsValidator', () => {
  beforeEach(() => {
    fieldLabel1 = faker.database.column();
    fieldLabel2 = faker.database.column();
    message = faker.random.words(5);
  });

  it('should return true if the two fields are equal', () => {
    const { sut } = makeSut();
    const equalValue = faker.random.word();
    const bodyTest = {
      [fieldLabel1]: equalValue,
      [fieldLabel2]: equalValue
    };

    const result = sut.validate(bodyTest);

    expect(result.isRight()).toBeTruthy();
  });

  it('should return NotEqualFieldsError if the two fields are not equal', () => {
    const { sut } = makeSut();
    const word = faker.random.word();
    const differentWord = makeDifferentWord(word);

    const bodyTest = {
      [fieldLabel1]: word,
      [fieldLabel2]: differentWord
    };

    const result = sut.validate(bodyTest);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new NotEqualFieldsError(bodyTest[fieldLabel1], bodyTest[fieldLabel2])
    );
  });

  it('should return NotEqualFieldsError if the first is not provider', () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
    const bodyTest = {
      [fieldLabel1]: faker.random.word()
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new NotEqualFieldsError(bodyTest[fieldLabel1], null)
    );
  });

  it('should return NotEqualFieldsError container the customMessage if fall', () => {
    const { sut } = makeSut(message);
    const word = faker.random.word();
    const differentWord = makeDifferentWord(word);
    const bodyTest = {
      [fieldLabel1]: word,
      [fieldLabel2]: differentWord
    };

    const result = sut.validate(bodyTest);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new NotEqualFieldsError(
        bodyTest[fieldLabel1],
        bodyTest[fieldLabel2],
        message
      )
    );
  });
});
