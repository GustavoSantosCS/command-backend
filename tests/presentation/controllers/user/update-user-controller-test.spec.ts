import faker from 'faker';
import { UserModel } from '@/domain/models';
import { HttpRequest } from '@/presentation/protocols';
import { ValidatorSpy } from '@tests/validation/mock';
import {
  CreateSessionUseCaseSpy,
  UpdateUserUseCaseSpy
} from '@tests/domain/mock/usecases';
import { UpdateUserController } from '@/presentation/controllers/user';

let httpRequest: HttpRequest<UpdateUserController.Params>;
let authenticated: { id: string };
let newUserData: Omit<UserModel, 'id'>;

let sut: UpdateUserController;
let validate: ValidatorSpy;
let usecaseUpdate: UpdateUserUseCaseSpy;
let usecaseCreateSession: CreateSessionUseCaseSpy;

describe('Test Unit: UpdateUserController', () => {
  beforeEach(() => {
    authenticated = { id: faker.datatype.uuid() };
    newUserData = {
      name: faker.random.word(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password()
    };

    httpRequest = {
      body: {
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        confirmPassword: newUserData.password,
        authenticated
      }
    };

    validate = new ValidatorSpy();
    usecaseUpdate = new UpdateUserUseCaseSpy();
    usecaseUpdate = new UpdateUserUseCaseSpy();
    usecaseCreateSession = new CreateSessionUseCaseSpy();
    sut = new UpdateUserController(
      validate,
      usecaseUpdate,
      usecaseCreateSession
    );
  });

  it('should call validate with the correct values', async () => {
    const spy = validate;

    await sut.handle(httpRequest);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual({
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password,
      confirmPassword: newUserData.password
    });
  });

  it('should return 400 if validate fall', async () => {
    const spy = validate;
    spy.return = spy.returns.left;

    const result = await sut.handle(httpRequest);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBeTruthy();
  });

  it('should call UpdateUserUseCase with the correct values', async () => {
    const spy = usecaseUpdate;

    await sut.handle(httpRequest);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual({
      id: authenticated.id,
      name: newUserData.name,
      email: newUserData.email,
      password: newUserData.password
    });
  });

  it('should return 500 if UpdateUserUseCase throws', async () => {
    const spy = usecaseUpdate;
    spy.throwError();

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should return 400 if UpdateUserUseCase return unsuccess', async () => {
    const spy = usecaseUpdate;
    spy.return = spy.returns.left;

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should return 200 if UpdateUserUseCase return success', async () => {
    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeTruthy();
  });
});
