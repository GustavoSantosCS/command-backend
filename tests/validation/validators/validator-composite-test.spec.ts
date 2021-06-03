import { Validator } from '@/validation/protocols';
import { ValidationComposite } from '@/validation/validators';

import { ValidatorSpy } from '@tests/validation/mock';

type SutTypes = {
  sut: ValidationComposite;
  validationsSpy: Validator[];
};

const makeSut = (): SutTypes => {
  const validationsSpy: Validator[] = [new ValidatorSpy(), new ValidatorSpy()];
  const sut = new ValidationComposite(validationsSpy);
  return { sut, validationsSpy };
};

describe('Test Unit RequiredFieldValidator', () => {
  it('should return true if all validators have valid result', () => {
    const { sut } = makeSut();

    const result = sut.validate({});

    expect(result.isRight()).toBeTruthy();
  });

  it('should return ValidatorError if une validator have invalid result', () => {
    const { sut, validationsSpy } = makeSut();

    const spy = validationsSpy[0] as ValidatorSpy;

    spy.return = spy.returns.left;

    const result = sut.validate({});

    expect(result.isLeft()).toBeTruthy();
  });

  it('should return ValidatorError if all validator have invalid result', () => {
    const { sut, validationsSpy } = makeSut();
    // eslint-disable-next-line no-restricted-syntax
    for (const spy of validationsSpy) {
      (spy as ValidatorSpy).return = (spy as ValidatorSpy).returns.left;
    }

    const result = sut.validate({});

    expect(result.isLeft()).toBeTruthy();
  });
});
