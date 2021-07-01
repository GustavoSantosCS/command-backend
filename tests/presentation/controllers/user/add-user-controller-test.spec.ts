import faker from 'faker';

import { UserModel } from '@/domain/models';
import { AddUserUseCase } from '@/domain/usecases';
import { AddUserController } from '@/presentation/controllers/user';
import { Validator } from '@/validation/protocols';

import { AddUserUseCaseSpy } from '@tests/domain/mock/usecases';
import { makeMockAddUserModel } from '@tests/domain/mock/models';
import { ValidatorSpy } from '@tests/validation/mock';
import { left } from '@/shared/either';
import { PersistencyError } from '@/infra/errors';
import { HttpRequest } from '@/presentation/protocols';

faker.locale = 'pt_BR';

export const makeMockHttpRequest =
  (): HttpRequest<AddUserController.Params> => ({
    body: { ...addUser }
  });

let addUser: Omit<UserModel, 'id'> & { confirmPassword: string };
let sut: AddUserController;
let httpRequestMock: HttpRequest<AddUserController.Params>;
let validatorSpy: Validator;
let addUserUseCaseSpy: AddUserUseCase;

describe('Test Unit: AddUserController', () => {
  beforeEach(() => {
    addUser = makeMockAddUserModel();
    httpRequestMock = makeMockHttpRequest();
    validatorSpy = new ValidatorSpy();
    addUserUseCaseSpy = new AddUserUseCaseSpy();
    sut = new AddUserController(validatorSpy, addUserUseCaseSpy);
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

  it('should call AddUserUseCase with the correct values', async () => {
    const spy = addUserUseCaseSpy as AddUserUseCaseSpy;

    await sut.handle(httpRequestMock);

    expect(spy.parameters).toEqual({
      name: addUser.name,
      email: addUser.email,
      password: addUser.password
    });
  });

  it('should return 400 if AddUserUseCase returns error', async () => {
    const spy = addUserUseCaseSpy as AddUserUseCaseSpy;
    spy.return = spy.returns.left;

    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should return 500 if the return of AddUserUseCase is PersistencyError', async () => {
    const spy = addUserUseCaseSpy as AddUserUseCaseSpy;
    spy.return = left(new PersistencyError('any_message', {}, 'any_value'));

    const response = await sut.handle(httpRequestMock);
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should returns 500 if AddUserUsecase throws', async () => {
    const spy = addUserUseCaseSpy as AddUserUseCaseSpy;
    spy.throwError();

    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
  });

  it('should return 200 if AddUserUseCase is success', async () => {
    const response = await sut.handle(httpRequestMock);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
  });
});
