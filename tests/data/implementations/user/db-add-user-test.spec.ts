import faker from 'faker';

import { DBAddUser } from '@/data/implementations/user';
import {
  IDGenerator,
  AddUserRepository,
  SearchUserByEmailRepository
} from '@/data/protocols';
import { Hasher } from '@/data/protocols/cryptography';
import { EmailAlreadyUseError } from '@/domain/errors';
import { UserModel } from '@/domain/models';

import { makeMockUserEntity } from '@tests/data/mock/entities';
import { IdGeneratorSpy } from '@tests/infra/mock';
import { HasherSpy } from '@tests/infra/mock/cryptography';
import {
  AddUserRepositorySpy,
  SearchUserByEmailRepositorySpy
} from '@tests/infra/mock/db/user';
import { right } from '@/shared/either';
import { UserEntity } from '@/data/entities';
import { PersistencyError } from '@/infra/errors';
import { makeMockUserModel } from '@tests/domain/mock/models';
import { persistencyError } from '@tests/shared/persistency-error-mock';

let sut: DBAddUser;
let idGeneratorSpy: IdGeneratorSpy;
let hasherSpy: HasherSpy;
let searchByEmailRepositorySpy: SearchUserByEmailRepositorySpy;
let addUserRepositorySpy: AddUserRepositorySpy;
let newUserModel: UserModel;
let userModelHashPassword: UserModel;
let userEntity: UserEntity;
let userEntityHashPassword: UserEntity;
let hashPassword: string;

describe('Test Unit: DBAddUser', () => {
  beforeEach(() => {
    newUserModel = makeMockUserModel({ id: false, avatar: false });
    userEntity = makeMockUserEntity({
      ...newUserModel,
      id: faker.datatype.uuid()
    });
    hashPassword = `${faker.datatype.uuid()}-${userEntity.password}`;
    userEntityHashPassword = { ...userEntity, password: hashPassword };
    userModelHashPassword = {
      ...newUserModel,
      id: userEntity.id,
      password: hashPassword
    };

    idGeneratorSpy = new IdGeneratorSpy();
    idGeneratorSpy.return = userEntity.id;

    searchByEmailRepositorySpy = new SearchUserByEmailRepositorySpy();
    searchByEmailRepositorySpy.return = null;

    hasherSpy = new HasherSpy();
    hasherSpy.return = hashPassword;

    addUserRepositorySpy = new AddUserRepositorySpy();
    addUserRepositorySpy.return = right(userEntityHashPassword);

    sut = new DBAddUser(
      idGeneratorSpy,
      hasherSpy,
      searchByEmailRepositorySpy,
      addUserRepositorySpy
    );
  });

  it('should call SearchUserByEmailRepository with the correct values', async () => {
    const spy = searchByEmailRepositorySpy;

    await sut.add(newUserModel);

    expect(spy.parameters).toEqual(newUserModel.email);
  });

  it('should return EmailAlreadyUseError if email already use', async () => {
    const spy = searchByEmailRepositorySpy;
    spy.return = userEntityHashPassword;

    const response = await sut.add(newUserModel);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new EmailAlreadyUseError(newUserModel.email)
    );
  });

  it('should call IDGenerator one time', async () => {
    const spy = idGeneratorSpy;

    await sut.add(newUserModel);

    expect(spy.calls).toBe(1);
  });

  it('should throws if IDGenerator throws', async () => {
    const spy = idGeneratorSpy;
    spy.throwsError();

    const promise = sut.add(newUserModel);

    await expect(promise).rejects.toThrow();
  });

  it('should call Hasher with the correct values', async () => {
    const spy = hasherSpy;

    await sut.add(newUserModel);

    expect(spy.parameters).toEqual(newUserModel.password);
  });

  it('should throws if Hasher throws', async () => {
    const spy = hasherSpy;
    spy.throwsError();

    const promise = sut.add(newUserModel);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddUserRepository with the correct values', async () => {
    const spy = addUserRepositorySpy;

    await sut.add(newUserModel);

    expect(spy.parameters).toEqual(userModelHashPassword);
  });

  it('should throws if AddUserRepository throws', async () => {
    const spy = addUserRepositorySpy;
    spy.throwsError();

    const promise = sut.add(newUserModel);

    await expect(promise).rejects.toThrow();
  });

  it('should return a new User if success to persistent', async () => {
    const response = await sut.add(newUserModel);

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual(userEntityHashPassword);
  });

  it('should return PersistencyError if fall to persistent', async () => {
    const spy = addUserRepositorySpy;
    spy.return = spy.returns.left;

    const result = await sut.add(newUserModel);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(persistencyError);
  });
});
