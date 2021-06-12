import faker from 'faker';
import { UserAvatarUseCase } from '@/domain/usecases/user';
import { UserAvatarController } from '@/presentation/controllers/user';
import { HttpRequest } from '@/presentation/protocols';
import { makeMockAvatarUserModel } from '@tests/domain/mock/models';
import { UserAvatarUseCaseSpy } from '@tests/domain/mock/usecases';
import { left } from '@/shared/either';
import { PersistencyError } from '@/infra/errors';

let sut: UserAvatarController;
let userAvatarUseCaseSpy: UserAvatarUseCase;

const makerHttpRequest = (): HttpRequest<UserAvatarController.Params> => ({
  body: {
    user: {
      id: faker.datatype.uuid()
    },
    avatar: {
      old: makeMockAvatarUserModel(),
      new: makeMockAvatarUserModel()
    }
  }
});

describe('Test Unit: UserAvatarController', () => {
  beforeEach(() => {
    userAvatarUseCaseSpy = new UserAvatarUseCaseSpy();
    sut = new UserAvatarController(userAvatarUseCaseSpy);
  });

  it('should call UserAvatarUseCase', async () => {
    const httpRequest = makerHttpRequest();
    const spy = userAvatarUseCaseSpy as UserAvatarUseCaseSpy;

    await sut.handle(httpRequest);

    expect(spy.parameters).toEqual(httpRequest.body);
  });

  it('should return 500 if UserAvatarUseCase throws', async () => {
    const httpRequest = makerHttpRequest();
    const spy = userAvatarUseCaseSpy as UserAvatarUseCaseSpy;
    spy.throwError();

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
  });

  it('should return 500 if the return of AddUserUseCase is PersistencyError', async () => {
    const httpRequest = makerHttpRequest();
    const spy = userAvatarUseCaseSpy as UserAvatarUseCaseSpy;
    spy.return = left(new PersistencyError('any_message', {}, 'any_value'));

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should return 200 if UserAvatarUseCase is success', async () => {
    const httpRequest = makerHttpRequest();

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
  });
});
