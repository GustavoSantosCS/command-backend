/* eslint-disable no-useless-escape */
import { Either, left, right } from '@/shared/either'
import { Validator } from '@/validation/protocols'
import { IsNotEmailError } from '@/validation/errors'

export class EmailValidator implements Validator {
  private readonly fieldName: string
  private readonly customMessage: string

  constructor(fieldName: string, customMessage: string) {
    this.fieldName = fieldName
    this.customMessage = customMessage
  }

  validate(value: any): Either<IsNotEmailError, true> {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return emailRegex.test(value[this.fieldName])
      ? right(true)
      : left(new IsNotEmailError(this.customMessage, this.fieldName))
  }
}
