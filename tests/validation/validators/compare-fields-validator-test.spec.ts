import faker from 'faker'
import { CompareFieldsValidator } from '@/validation/validators'
import { NotEqualFieldsError } from '@/validation/errors'

let fieldLabel1: string
let fieldLabel2: string

let message: string

type SutTypes = { sut: CompareFieldsValidator, validateMessage: string }

const makeSut = (messageValidator?: string): SutTypes => ({
  sut: new CompareFieldsValidator(
    fieldLabel1,
    fieldLabel2,
    messageValidator || message
  ),
  validateMessage: messageValidator || message
})

const makeDifferentWord = (word: string): string => {
  let differentWord = word
  while (word === differentWord) {
    differentWord = faker.random.word()
  }

  return differentWord
}

const makeDifferentColumn = (column: string): string => {
  let differentColumn = column
  while (column === differentColumn) {
    differentColumn = faker.database.column()
  }

  return differentColumn
}

describe('Test Unit CompareFieldsValidator', () => {
  beforeEach(() => {
    fieldLabel1 = faker.database.column()
    fieldLabel2 = makeDifferentColumn(fieldLabel1)
    message = faker.random.words(5)
  })

  it('should return true if the two fields are equal', () => {
    const { sut } = makeSut()
    const equalValue = faker.random.word()
    const bodyTest = {
      [fieldLabel1]: equalValue,
      [fieldLabel2]: equalValue
    }

    const result = sut.validate(bodyTest)

    expect(result.isRight()).toBeTruthy()
  })

  it('should return NotEqualFieldsError if the two fields are not equal', () => {
    const { sut } = makeSut()
    const word = faker.random.word()
    const differentWord = makeDifferentWord(word)

    const bodyTest = {
      [fieldLabel1]: word,
      [fieldLabel2]: differentWord
    }

    const result = sut.validate(bodyTest)
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new NotEqualFieldsError(message, bodyTest[fieldLabel1])
    )
  })

  it('should return NotEqualFieldsError if the first is not provider', () => {
    const { sut } = makeSut()
    const bodyTest = {
      [fieldLabel2]: faker.random.word()
    }

    const result = sut.validate(bodyTest)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new NotEqualFieldsError(message, bodyTest[fieldLabel2])
    )
  })

  it('should return NotEqualFieldsError if the secund is not provider', () => {
    const { sut } = makeSut()
    const bodyTest = {
      [fieldLabel1]: faker.random.word()
    }

    const result = sut.validate(bodyTest)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new NotEqualFieldsError(message, bodyTest[fieldLabel1])
    )
  })

  it('should return NotEqualFieldsError container the customMessage if fall', () => {
    const { sut, validateMessage } = makeSut(`${message} custom`)
    const word = faker.random.word()
    const differentWord = makeDifferentWord(word)
    const bodyTest = {
      [fieldLabel1]: word,
      [fieldLabel2]: differentWord
    }

    const result = sut.validate(bodyTest)

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new NotEqualFieldsError(validateMessage, fieldLabel1)
    )
  })
})
