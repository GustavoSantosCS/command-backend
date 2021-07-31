import { DBUserAvatar } from '@/data/implementations';
import { AvatarEntity, UserEntity } from '@/data/entities';
import { UnlinkImageSpy } from '@tests/infra/mock/img-handler';
import { GetUserByIdRepositorySpy } from '@tests/infra/mock/db/user/get-user-by-id-repository-spy';
import { UserAvatarRepositorySpy } from '@tests/infra/mock/db/user';
import { makeMockAvatarUser, makeMockUser } from '@tests/domain/mock/models';

let sut: DBUserAvatar;
let getUserByIdRepository: GetUserByIdRepositorySpy;
let avatarRepository: UserAvatarRepositorySpy;
let unlinkAvatar: UnlinkImageSpy;
let userEntity: UserEntity;
let newAvatar: AvatarEntity;
let avatar: AvatarEntity;

describe('Test Unit DBUserAvatar', () => {
  beforeEach(() => {
    userEntity = makeMockUser({ id: true, avatar: true });
    newAvatar = makeMockAvatarUser();

    avatar = { ...newAvatar, user: userEntity };
    getUserByIdRepository = new GetUserByIdRepositorySpy();
    getUserByIdRepository.return = userEntity;

    unlinkAvatar = new UnlinkImageSpy();
    avatarRepository = new UserAvatarRepositorySpy();
    avatarRepository.return = newAvatar;

    sut = new DBUserAvatar(
      getUserByIdRepository,
      unlinkAvatar,
      avatarRepository
    );
  });

  it('should call getUserByIdRepository with correct values', async () => {
    const spy = getUserByIdRepository;

    await sut.saveAvatar({ userId: userEntity.id, avatar: newAvatar });

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual(userEntity.id);
  });

  it('should throws if getUserByIdRepository throws', async () => {
    const spy = getUserByIdRepository;
    spy.throwsError();

    const promise = sut.saveAvatar({
      userId: userEntity.id,
      avatar: newAvatar
    });

    expect(promise).rejects.toThrow();
  });

  it('should not call UnlinkAvatar if user not have a current avatar', async () => {
    const repoSpy = getUserByIdRepository;
    delete userEntity.avatar;
    repoSpy.return = userEntity;
    const unlinkSpy = unlinkAvatar;

    await sut.saveAvatar({ userId: userEntity.id, avatar: newAvatar });

    expect(unlinkSpy.calls).toBe(0);
  });

  it('should call UnlinkAvatar if user have a current avatar', async () => {
    const repoSpy = getUserByIdRepository;
    repoSpy.return = userEntity;

    const unlinkSpy = unlinkAvatar;

    await sut.saveAvatar({ userId: userEntity.id, avatar: newAvatar });

    expect(unlinkSpy.calls).toBe(1);
    expect(unlinkSpy.parameters).toEqual(userEntity.avatar);
  });

  it('should throws if UnlinkAvatar throws', async () => {
    const spy = unlinkAvatar;
    spy.throwsError();

    const promise = sut.saveAvatar({
      userId: userEntity.id,
      avatar: newAvatar
    });

    expect(promise).rejects.toThrow();
  });

  it('should call UserAvatarRepository with correct values', async () => {
    const spy = avatarRepository;

    await sut.saveAvatar({ userId: userEntity.id, avatar: newAvatar });

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual(avatar);
  });

  it('should throws if UserAvatarRepository throws', async () => {
    const spy = avatarRepository;
    spy.throwsError();

    const promise = sut.saveAvatar({
      userId: userEntity.id,
      avatar: newAvatar
    });

    expect(promise).rejects.toThrow();
  });

  it('should return AvatarEntity if success', async () => {
    const result = await sut.saveAvatar({
      userId: userEntity.id,
      avatar: newAvatar
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(newAvatar);
  });
});
