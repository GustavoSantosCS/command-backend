import faker from 'faker';
import { UpdateAvatarUseCase } from '@/domain/usecases/user';
import { UpdateUserAvatarController } from '@/presentation/controllers/user';
import { HttpRequest } from '@/presentation/protocols';
import { makeMockAvatarUserModel } from '@tests/domain/mock/models';
import { UpdateAvatarUseCaseSpy } from '@tests/domain/mock/usecases';
import { left } from '@/shared/either';
import { PersistencyError } from '@/infra/errors';

let sut: UpdateUserAvatarController;
let updateAvatarUseCaseSpy: UpdateAvatarUseCase;

const makerHttpRequest = (): HttpRequest<UpdateUserAvatarController.DTO> => ({
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

describe('Test Unit: UpdateUserAvatarController', () => {
  beforeEach(() => {
    updateAvatarUseCaseSpy = new UpdateAvatarUseCaseSpy();
    sut = new UpdateUserAvatarController(updateAvatarUseCaseSpy);
  });

  it('should call UpdateAvatarUseCase', async () => {
    const httpRequest = makerHttpRequest();
    const spy = updateAvatarUseCaseSpy as UpdateAvatarUseCaseSpy;

    await sut.handle(httpRequest);

    expect(spy.parameters).toEqual(httpRequest.body);
  });

  it('should return 500 if UpdateAvatarUseCase throws', async () => {
    const httpRequest = makerHttpRequest();
    const spy = updateAvatarUseCaseSpy as UpdateAvatarUseCaseSpy;
    spy.throwError();

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
  });

  it('should return 500 if the return of AddUserUseCase is PersistencyError', async () => {
    const httpRequest = makerHttpRequest();
    const spy = updateAvatarUseCaseSpy as UpdateAvatarUseCaseSpy;
    spy.return = left(new PersistencyError('any_message', {}, 'any_value'));

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0]).toHaveProperty('message');
    expect(response.body.errors[0]).toHaveProperty('value');
  });

  it('should return 200 if UpdateAvatarUseCase is success', async () => {
    const httpRequest = makerHttpRequest();

    const response = await sut.handle(httpRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
  });
});
