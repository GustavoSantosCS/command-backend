import faker from 'faker';

import { DBAddUser } from '@/data/implementations';

import { EmailAlreadyUseError } from '@/domain/errors';

import { IdGeneratorSpy } from '@tests/infra/mock';
import { HasherSpy } from '@tests/infra/mock/cryptography';
import {
  AddUserRepositorySpy,
  SearchUserByEmailRepositorySpy
} from '@tests/infra/mock/db/user';
import { UserEntity } from '@/data/entities';
import { makeMockUser } from '@tests/domain/mock/models';

let sut: DBAddUser;
let idGeneratorSpy: IdGeneratorSpy;
let hasherSpy: HasherSpy;
let searchByEmailRepositorySpy: SearchUserByEmailRepositorySpy;
let addUserRepositorySpy: AddUserRepositorySpy;
let newUserEntity: UserEntity;
let UserEntityHashPassword: UserEntity;
let userEntity: UserEntity;
let userEntityHashPassword: UserEntity;
let hashPassword: string;

describe('Test Unit: DBAddUser', () => {
  beforeEach(() => {
    newUserEntity = makeMockUser({ id: false, avatar: false });
    userEntity = {
      ...newUserEntity,
      id: faker.datatype.uuid()
    };
    delete newUserEntity.updatedAt;
    delete newUserEntity.createdAt;

    hashPassword = `${faker.datatype.uuid()}-${userEntity.password}`;
    userEntityHashPassword = { ...userEntity, password: hashPassword };
    UserEntityHashPassword = {
      ...newUserEntity,
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
    addUserRepositorySpy.return = userEntityHashPassword;

    sut = new DBAddUser(
      idGeneratorSpy,
      hasherSpy,
      searchByEmailRepositorySpy,
      addUserRepositorySpy
    );
  });

  it('should call SearchUserByEmailRepository with the correct values', async () => {
    const spy = searchByEmailRepositorySpy;

    await sut.save(newUserEntity);

    expect(spy.parameters).toEqual(newUserEntity.email);
  });

  it('should return EmailAlreadyUseError if email already use', async () => {
    const spy = searchByEmailRepositorySpy;
    spy.return = userEntityHashPassword;

    const response = await sut.save(newUserEntity);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new EmailAlreadyUseError(newUserEntity.email)
    );
  });

  it('should call IDGenerator one time', async () => {
    const spy = idGeneratorSpy;

    await sut.save(newUserEntity);

    expect(spy.calls).toBe(1);
  });

  it('should throws if IDGenerator throws', async () => {
    const spy = idGeneratorSpy;
    spy.throwsError();

    const promise = sut.save(newUserEntity);

    await expect(promise).rejects.toThrow();
  });

  it('should call Hasher with the correct values', async () => {
    const spy = hasherSpy;

    await sut.save(newUserEntity);

    expect(spy.parameters).toEqual(newUserEntity.password);
  });

  it('should throws if Hasher throws', async () => {
    const spy = hasherSpy;
    spy.throwsError();

    const promise = sut.save(newUserEntity);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddUserRepository with the correct values', async () => {
    const spy = addUserRepositorySpy;

    await sut.save(newUserEntity);

    expect(spy.parameters).toEqual(UserEntityHashPassword);
  });

  it('should throws if AddUserRepository throws', async () => {
    const spy = addUserRepositorySpy;
    spy.throwsError();

    const promise = sut.save(newUserEntity);

    await expect(promise).rejects.toThrow();
  });

  it('should return a new User if success to persistent', async () => {
    const response = await sut.save(newUserEntity);

    const aux = userEntityHashPassword;
    delete aux.password;
    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual(aux);
  });
});
