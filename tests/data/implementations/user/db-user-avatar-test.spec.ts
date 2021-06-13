import { DBUserAvatar } from '@/data/implementations/user';
import { UnlinkImageSpy } from '@tests/infra/mock/img-handler';
import { AvatarModel, UserModel } from '@/domain/models';
import {
  makeMockAvatarUserModel,
  makeMockUserModel
} from '@tests/domain/mock/models';
import { GetUserByIdRepositorySpy } from '@tests/infra/mock/db/user/get-user-by-id-repository-spy';
import { UserEntity } from '@/data/entities';
import { makeMockUserEntity } from '@tests/data/mock/entities';
import { UserAvatarRepositorySpy } from '@tests/infra/mock/db/user';
import { right } from '@/shared/either';
import { PersistencyError } from '@/infra/errors';

let sut: DBUserAvatar;
let getUserByIdRepository: GetUserByIdRepositorySpy;
let avatarRepository: UserAvatarRepositorySpy;
let unlinkAvatar: UnlinkImageSpy;
let userModel: UserModel;
let userEntity: UserEntity;
let newAvatar: AvatarModel;

describe('Test Unit DBUserAvatar', () => {
  beforeEach(() => {
    userModel = makeMockUserModel({ id: true, avatar: true });
    newAvatar = makeMockAvatarUserModel();
    userEntity = makeMockUserEntity(userModel);

    getUserByIdRepository = new GetUserByIdRepositorySpy();
    getUserByIdRepository.return = userEntity;

    unlinkAvatar = new UnlinkImageSpy();
    avatarRepository = new UserAvatarRepositorySpy();
    avatarRepository.return = right(newAvatar);

    sut = new DBUserAvatar(
      getUserByIdRepository,
      unlinkAvatar,
      avatarRepository
    );
  });

  it('should call getUserByIdRepository with correct values', async () => {
    const spy = getUserByIdRepository;

    await sut.saveAvatar({ user: { id: userModel.id }, avatar: newAvatar });

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual(userModel.id);
  });

  it('should throws if getUserByIdRepository throws', async () => {
    const spy = getUserByIdRepository;
    spy.throwsError();

    const promise = sut.saveAvatar({
      user: { id: userModel.id },
      avatar: newAvatar
    });

    expect(promise).rejects.toThrow();
  });

  it('should not call UnlinkAvatar if user not have a current avatar', async () => {
    const repoSpy = getUserByIdRepository;
    delete userEntity.avatar;
    repoSpy.return = userEntity;
    const unlinkSpy = unlinkAvatar;

    await sut.saveAvatar({ user: { id: userModel.id }, avatar: newAvatar });

    expect(unlinkSpy.calls).toBe(0);
  });

  it('should call UnlinkAvatar if user have a current avatar', async () => {
    const repoSpy = getUserByIdRepository;
    repoSpy.return = userEntity;

    const unlinkSpy = unlinkAvatar;

    await sut.saveAvatar({ user: { id: userModel.id }, avatar: newAvatar });

    expect(unlinkSpy.calls).toBe(1);
    expect(unlinkSpy.parameters).toEqual(userModel.avatar);
  });

  it('should throws if UnlinkAvatar throws', async () => {
    const spy = unlinkAvatar;
    spy.throwsError();

    const promise = sut.saveAvatar({
      user: { id: userModel.id },
      avatar: newAvatar
    });

    expect(promise).rejects.toThrow();
  });

  it('should call UserAvatarRepository with correct values', async () => {
    const spy = avatarRepository;

    await sut.saveAvatar({ user: { id: userModel.id }, avatar: newAvatar });

    expect(spy.calls).toBe(1);
    expect(spy.parameters.avatar).toEqual(newAvatar);
    expect(spy.parameters.user).toEqual({ id: userModel.id });
  });

  it('should throws if UserAvatarRepository throws', async () => {
    const spy = avatarRepository;
    spy.throwsError();

    const promise = sut.saveAvatar({
      user: { id: userModel.id },
      avatar: newAvatar
    });

    expect(promise).rejects.toThrow();
  });

  it('should return PersistencyError if UserAvatarRepository not success', async () => {
    const spy = avatarRepository;
    spy.return = spy.returns.left;

    const result = await sut.saveAvatar({
      user: { id: userModel.id },
      avatar: newAvatar
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new PersistencyError('any_message', {}, 'any_value')
    );
  });

  it('should return AvatarModel if success', async () => {
    const result = await sut.saveAvatar({
      user: { id: userModel.id },
      avatar: newAvatar
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(newAvatar);
  });
});
