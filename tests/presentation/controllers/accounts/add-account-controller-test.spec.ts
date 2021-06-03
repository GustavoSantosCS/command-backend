import faker from 'faker';

import { Account } from '@/domain/models';
import { EmailAlreadyUseError } from '@/domain/errors';
import { AddAccountUseCase } from '@/domain/usecases/account';
import { AddAccountController } from '@/presentation/controllers/accounts';
import { HttpRequest } from '@/presentation/protocols';
import { Validator } from '@/validator/protocols';
import { ValidatorError } from '@/validator/errors';

import { AddAccountUseCaseSpy } from '@tests/domain/usecases';
import { makeMockAddAccount } from '@tests/domain/models';
import { ValidatorSpy } from '@tests/validator/mock';
import { throwsError } from '@tests/shared';

faker.locale = 'pt_BR';

export const makeMockHttpRequest = (): HttpRequest => ({
  body: { ...addAccount }
});

let addAccount: Omit<Account, 'id'>;
let sut: AddAccountController;
let httpRequestMock: HttpRequest;
let validatorSpy: Validator;
let addAccountUseCaseSpy: AddAccountUseCase;

describe('Test Unit: AddAccountController', () => {
  beforeEach(() => {
    addAccount = makeMockAddAccount();
    httpRequestMock = makeMockHttpRequest();
    validatorSpy = new ValidatorSpy();
    addAccountUseCaseSpy = new AddAccountUseCaseSpy();
    sut = new AddAccountController(validatorSpy, addAccountUseCaseSpy);
  });

  it('should call the validator with the correct values', async () => {
    const spy = validatorSpy as ValidatorSpy;
    await sut.handle(httpRequestMock);

    expect(spy.parameters).toEqual(httpRequestMock.body);
  });

  it('should return 400 if validator returns error', async () => {
    const spy = validatorSpy as ValidatorSpy;
    spy.return = spy.returns.left;

    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should call AddAccountUseCase with the correct values', async () => {
    const spy = addAccountUseCaseSpy as AddAccountUseCaseSpy;

    await sut.handle(httpRequestMock);

    expect(spy.parameters).toEqual(httpRequestMock.body);
  });

  it('should return 400 if AddAccountUseCase returns error', async () => {
    const spy = addAccountUseCaseSpy as AddAccountUseCaseSpy;
    spy.return = spy.returns.left;

    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should returns 500 if AddAccountUsecase throws', async () => {
    const spy = addAccountUseCaseSpy as AddAccountUseCaseSpy;
    spy.throwError();

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
