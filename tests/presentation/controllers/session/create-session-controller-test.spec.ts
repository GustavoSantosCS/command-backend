import faker from 'faker';
import { CreateSessionController } from '@/presentation/controllers/session';
import { HttpRequest } from '@/presentation/protocols';
import { Validator } from '@/validation/protocols';
import { ValidatorSpy } from '@tests/validation/mock';
import { CreateSessionUseCase } from '@/domain/usecases';
import { CreateSessionUseCaseSpy } from '@tests/domain/mock/usecases';
import { left } from '@/shared/either';
import { LoginError } from '@/presentation/errors/login-error';

let sut: CreateSessionController;
let validatorSpy: Validator;
let httpRequest: HttpRequest<CreateSessionController.Params>;
let data: CreateSessionController.Params;
let usecase: CreateSessionUseCase;

describe('Test Unit: CreateSessionController', () => {
  beforeEach(() => {
    data = {
      email: faker.internet.email().toLowerCase(),
      password: faker.random.word()
    };
    httpRequest = { body: data };
    validatorSpy = new ValidatorSpy();
    usecase = new CreateSessionUseCaseSpy();
    sut = new CreateSessionController(validatorSpy, usecase);
  });

  it('should call Validator with the correct values', async () => {
    const spy = validatorSpy as ValidatorSpy;

    await sut.handle(httpRequest);

    expect(spy.parameters).toEqual(data);
  });

  it('should return 400 if the Validator return unsuccess', async () => {
    const spy = validatorSpy as ValidatorSpy;
    spy.return = spy.returns.left;

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should call CreateSessionUseCase with the correct values', async () => {
    const spy = usecase as CreateSessionUseCaseSpy;

    await sut.handle(httpRequest);

    expect(spy.parameters).toEqual(data);
  });

  it('should return 400 if the CreateSessionUseCase fall', async () => {
    const spy = usecase as CreateSessionUseCaseSpy;
    spy.return = left(new LoginError(data));

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should return 500 if the CreateSessionUseCase throws', async () => {
    const spy = usecase as CreateSessionUseCaseSpy;
    spy.throwError();

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should return 200 and the token if the CreateSessionUseCase success', async () => {
    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
  });
});
