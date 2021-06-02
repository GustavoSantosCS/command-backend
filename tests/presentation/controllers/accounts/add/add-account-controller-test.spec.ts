import { AddAccountUseCase } from '@/domain/usecases/account';
import { AddAccountController } from '@/presentation/controllers/accounts';
import { HttpRequest } from '@/presentation/protocols';
import { Validator } from '@/validator/protocols';
import { makeMockAddAccountUseCase } from '@tests/domain/usecases';
import { makeMockValidator } from '@tests/validator/mock';
import { makeMockHttpRequest } from '@tests/presentation/controllers/accounts/add/mock';
import { left } from '@/shared/either';
import { ValidatorError } from '@/validator/errors';
import faker from 'faker';
import { AddressAlreadyUseError } from '@/domain/errors';

let sut: AddAccountController;
let httpRequestMock: HttpRequest;
let validatorMock: Validator;
let addAccountUseCaseMock: AddAccountUseCase;

describe('Test Unit: AddAccountController', () => {
  beforeEach(() => {
    httpRequestMock = makeMockHttpRequest();
    validatorMock = makeMockValidator();
    addAccountUseCaseMock = makeMockAddAccountUseCase();
    sut = new AddAccountController(validatorMock, addAccountUseCaseMock);
  });

  it('should call the validator with the correct values', async () => {
    const spy = jest.spyOn(validatorMock, 'validate');
    await sut.handle(httpRequestMock);

    expect(spy).toBeCalledWith(httpRequestMock.body);
  });

  it('should return 400 if validator returns error', async () => {
    jest
      .spyOn(validatorMock, 'validate')
      .mockImplementationOnce(() =>
        left([new ValidatorError('any_message', 'any_value')])
      );

    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should call AddAcCountUseCase with the correct values', async () => {
    const spy = jest.spyOn(addAccountUseCaseMock, 'add');
    await sut.handle(httpRequestMock);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(httpRequestMock.body);
  });

  it('should return 400 if AddAccountUseCase returns error', async () => {
    const email = faker.internet.email();
    jest
      .spyOn(addAccountUseCaseMock, 'add')
      .mockImplementationOnce(async () =>
        left(new AddressAlreadyUseError(email))
      );
    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should returns 500 if AddAccountUsecase throws', async () => {
    jest
      .spyOn(addAccountUseCaseMock, 'add')
      .mockImplementationOnce(throwsError);

    const response = await sut.handle(httpRequestMock);
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
  });

  it('should return 200 if AddAccountUseCase is success', async () => {
    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
  });
});

const throwsError = () => {
  throw new Error('any_message');
};
