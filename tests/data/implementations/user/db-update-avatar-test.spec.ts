import faker from 'faker';
import { env } from '@/main/config/env';
import { DBUserAvatar } from '@/data/implementations/user';
import { UnlinkAvatar, UserAvatarRepository } from '@/data/protocols';
import { AvatarModel } from '@/domain/models';
import { UserAvatarUseCase } from '@/domain/usecases/user';
import { UnlinkImageSpy } from '@tests/infra/mock';
import { UserAvatarRepositorySpy } from '@tests/infra/mock/db/user';
import { PersistencyError } from '@/infra/errors';
import { right } from '@/shared/either';

export const makeMockUserAvatarUserCase = (): UserAvatarUseCase.Params => {
  const user = {
    id: faker.datatype.uuid()
  };

  let originalName = faker.random.word();

  const old = {
    originalName,
    persistentName: `${faker.datatype.uuid()}-${originalName}`,
    target: `${env.app.protocol}://${env.app.host}:${env.app.port}/files/${originalName}`
  } as AvatarModel;

  originalName = faker.random.word();

  const newAvatar = {
    originalName,
    persistentName: `${faker.datatype.uuid()}-${originalName}`,
    target: `${env.app.protocol}://${env.app.host}:${env.app.port}/files/${originalName}`
  } as AvatarModel;

  return {
    user,
    avatar: {
      old,
      new: newAvatar
    }
  };
};

let sut: DBUserAvatar;
let repository: UserAvatarRepository;
let unlinkAvatar: UnlinkAvatar;
let data: UserAvatarUseCase.Params;

describe('Test Unit DBUserAvatar', () => {
  beforeEach(() => {
    unlinkAvatar = new UnlinkImageSpy();
    repository = new UserAvatarRepositorySpy();
    sut = new DBUserAvatar(unlinkAvatar, repository);
    data = makeMockUserAvatarUserCase();
  });

  it('should call UnlinkAvatar with correct values', async () => {
    const spy = unlinkAvatar as UnlinkImageSpy;

    await sut.save(data);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual(data.avatar.old);
  });

  it('should call UnlinkAvatar if have a old avatar', async () => {
    const spy = unlinkAvatar as UnlinkImageSpy;

    await sut.save(data);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual(data.avatar.old);
  });

  it('should not call UnlinkAvatar if not have a old avatar', async () => {
    const spy = unlinkAvatar as UnlinkImageSpy;

    delete data.avatar.old;

    await sut.save(data);

    expect(spy.calls).toBe(0);
  });

  it('should call UserAvatarRepository with correct values', async () => {
    const spy = repository as UserAvatarRepositorySpy;

    await sut.save(data);

    expect(spy.calls).toBe(1);
    const { user } = data;
    const { new: newAvatar } = data.avatar;
    expect(spy.parameters).toEqual({
      user,
      avatar: newAvatar
    });
  });

  it('should throws if UnlinkAvatar throws', async () => {
    const spy = unlinkAvatar as UnlinkImageSpy;
    spy.throwsError();

    const promise = sut.save(data);

    await expect(promise).rejects.toThrow();
  });

  it('should throws if UserAvatarRepository throws', async () => {
    const spy = repository as UserAvatarRepositorySpy;
    spy.throwsError();

    const promise = sut.save(data);

    await expect(promise).rejects.toThrow();
  });

  it('should return PersistencyError if UserAvatarRepository not success', async () => {
    const spy = repository as UserAvatarRepositorySpy;
    spy.return = spy.returns.left;

    const result = await sut.save(data);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new PersistencyError('any_message', {}, 'any_value')
    );
  });

  it('should return AvatarModel if success', async () => {
    const spy = repository as UserAvatarRepositorySpy;
    spy.return = right(data.avatar.new);

    const result = await sut.save(data);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(data.avatar.new);
  });
});
