import faker from 'faker'
import { RequiredFieldValidator } from '@/validation/validators'
import { MissingParamError } from '@/validation/errors'

let fieldLabel: string
let message: string

const makeSut = (
  customMessage?: string
): { sut: RequiredFieldValidator, validateMessage: string } => ({
  sut: new RequiredFieldValidator(fieldLabel, customMessage || message),
  validateMessage: customMessage || message
})

describe('Test Unit RequiredFieldValidator', () => {
  beforeEach(() => {
    fieldLabel = faker.database.column()
    message = faker.random.words(5)
  })

  it('should return true if value is provider', () => {
    const { sut } = makeSut()
    const result = sut.validate({ [fieldLabel]: faker.random.word() })

    expect(result.isRight()).toBeTruthy()
  })

  it('should return MissingParamError if value is not provider', () => {
    const { sut } = makeSut()
    const result = sut.validate({ [fieldLabel]: null })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(new MissingParamError(message, fieldLabel))
  })

  it('should return to custom message if value is provisioned', () => {
    const { sut, validateMessage } = makeSut(`${message} custom`)
    const result = sut.validate({ [fieldLabel]: null })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new MissingParamError(validateMessage, fieldLabel)
    )
  })

  it('should return to custom message if value is undefined', () => {
    const { sut, validateMessage } = makeSut(`${message} custom`)
    const result = sut.validate({ [fieldLabel]: undefined })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toEqual(
      new MissingParamError(validateMessage, fieldLabel)
    )
  })

  it('should return validated if the value supplied is a boolean false', () => {
    const { sut } = makeSut()
    const result = sut.validate({ [fieldLabel]: false })

    expect(result.isRight()).toBeTruthy()
  })
})
