import faker from 'faker';
import { UserEntity } from '@/data/entities';
import { UserModel } from '@/domain/models';
import { UpdateUserUseCase } from '@/domain/usecases';
import { makeMockUserEntity } from '@tests/data/mock/entities';
import { makeMockUserModel } from '@tests/domain/mock/models';
import { HasherSpy, HashComparerSpy } from '@tests/infra/mock/cryptography';
import {
  GetUserByIdRepositorySpy,
  SearchUserByEmailRepositorySpy,
  UpdateUserRepositorySpy
} from '@tests/infra/mock/db/user';
import { EmailAlreadyUseError } from '@/domain/errors';
import { DBUpdateUser } from '@/data/implementations';

let sut: UpdateUserUseCase;
let searchByEmailRepositorySpy: SearchUserByEmailRepositorySpy;
let updateUserRepositorySpy: UpdateUserRepositorySpy;
let getUserByIdRepository: GetUserByIdRepositorySpy;
let hasherSpy: HasherSpy;
let hashComparerSpy: HashComparerSpy;

let newUserModel: UserModel;
let newUserModelHashPassword: UserModel;
let userEntity: UserEntity;
let userEntityHashPassword: UserEntity;
let userEntityDifferentEmail: UserEntity;
let hashPassword: string;

describe('Test Unit: DBUpdateUser', () => {
  beforeEach(() => {
    newUserModel = makeMockUserModel({ id: true, avatar: true });

    hashPassword = `${faker.datatype.uuid()}-${newUserModel.password}`;
    newUserModelHashPassword = { ...newUserModel, password: hashPassword };

    userEntity = makeMockUserEntity({
      ...newUserModel
    });
    userEntityHashPassword = { ...userEntity, password: hashPassword };

    userEntityDifferentEmail = {
      ...userEntityHashPassword,
      email: faker.datatype.uuid() + userEntityHashPassword.email
    };

    searchByEmailRepositorySpy = new SearchUserByEmailRepositorySpy();
    searchByEmailRepositorySpy.return = null;

    hasherSpy = new HasherSpy();
    hasherSpy.return = hashPassword;
    hashComparerSpy = new HashComparerSpy();

    updateUserRepositorySpy = new UpdateUserRepositorySpy();
    updateUserRepositorySpy.return = userEntityHashPassword;

    getUserByIdRepository = new GetUserByIdRepositorySpy();
    getUserByIdRepository.return = userEntity;

    sut = new DBUpdateUser(
      getUserByIdRepository,
      hasherSpy,
      hashComparerSpy,
      searchByEmailRepositorySpy,
      updateUserRepositorySpy
    );
  });

  it('should call GetUserByIdRepository with the correct values', async () => {
    const spy = getUserByIdRepository;

    await sut.update(newUserModel);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toBe(newUserModel.id);
  });

  it('should call SearchByEmailRepository if the TrackUser have different email', async () => {
    getUserByIdRepository.return = userEntityDifferentEmail;
    const spy = searchByEmailRepositorySpy;

    await sut.update(newUserModel);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toBe(newUserModel.email);
  });

  it('should return EmailAlreadyUseError if the email is already in use and is not the user current', async () => {
    getUserByIdRepository.return = userEntityDifferentEmail;
    searchByEmailRepositorySpy.return = userEntityHashPassword;

    const result = await sut.update(newUserModel);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new EmailAlreadyUseError(newUserModel.email));
  });

  it('should call Hasher with the correct', async () => {
    const spy = hasherSpy;

    await sut.update(newUserModel);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toBe(newUserModel.password);
  });

  it('should call UpdateUserRepository with the correct', async () => {
    const spy = updateUserRepositorySpy;

    await sut.update(newUserModel);

    expect(spy.calls).toBe(1);
    expect(spy.parameters).toEqual(newUserModelHashPassword);
  });

  it('should throws if GetUserByIdRepository throws', async () => {
    const spy = getUserByIdRepository;
    spy.throwsError();

    const promise = sut.update(newUserModel);

    await expect(promise).rejects.toThrow();
  });

  it('should throws if SearchByEmailRepository throws', async () => {
    getUserByIdRepository.return = userEntityDifferentEmail;
    searchByEmailRepositorySpy.throwsError();

    const promise = sut.update(newUserModel);

    await expect(promise).rejects.toThrow();
  });

  it('should throws if UpdateUserRepository throws', async () => {
    const spy = updateUserRepositorySpy;
    spy.throwsError();

    const promise = sut.update(newUserModel);

    await expect(promise).rejects.toThrow();
  });

  it('should return UserModel if success', async () => {
    const result = await sut.update(newUserModel);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual(userEntityHashPassword);
  });
});
