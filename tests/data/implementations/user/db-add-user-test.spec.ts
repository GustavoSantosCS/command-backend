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

const configNewUser = (): UserEntity => {
  const addUser: UserEntity = {
    ...newUser,
    id: faker.datatype.uuid(),
    password: `${newUser.password}-hash`,
    createdAt: null,
    updateAt: null,
    deleteAt: null
  };
  const hasher = hasherSpy as HasherSpy;
  hasher.return = addUser.password;
  const generator = idGeneratorSpy as IdGeneratorSpy;
  generator.return = addUser.id;
  return addUser;
};

let sut: DBAddUser;
let idGeneratorSpy: IDGenerator;
let hasherSpy: Hasher;
let searchByEmailRepositorySpy: SearchUserByEmailRepository;
let addUserRepositorySpy: AddUserRepository;
let newUser: Omit<UserModel, 'id'>;

describe('Test Unit: DBAddUser', () => {
  beforeEach(() => {
    newUser = makeMockUserEntity();
    idGeneratorSpy = new IdGeneratorSpy();
    searchByEmailRepositorySpy = new SearchUserByEmailRepositorySpy();
    addUserRepositorySpy = new AddUserRepositorySpy();
    hasherSpy = new HasherSpy();

    sut = new DBAddUser(
      idGeneratorSpy,
      hasherSpy,
      searchByEmailRepositorySpy,
      addUserRepositorySpy
    );
  });

  it('should call SearchUserByEmailRepository with the correct values', async () => {
    const spy = searchByEmailRepositorySpy as SearchUserByEmailRepositorySpy;

    await sut.add(newUser);

    expect(spy.parameters).toEqual(newUser.email);
  });

  it('should return EmailAlreadyUseError if email already use', async () => {
    const spy = searchByEmailRepositorySpy as SearchUserByEmailRepositorySpy;
    spy.return = spy.returns.right;

    const response = await sut.add(newUser);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new EmailAlreadyUseError(newUser.email));
  });

  it('should call IDGenerator', async () => {
    const spy = idGeneratorSpy as IdGeneratorSpy;

    await sut.add(newUser);

    expect(spy.callQuantity).toBe(1);
  });

  it('should throws if IDGenerator throws', async () => {
    const spy = idGeneratorSpy as IdGeneratorSpy;
    spy.throwsError();

    const promise = sut.add(newUser);

    await expect(promise).rejects.toThrow();
  });

  it('should call Hasher with the correct values', async () => {
    const spy = hasherSpy as HasherSpy;

    await sut.add(newUser);

    expect(spy.parameters).toEqual(newUser.password);
  });

  it('should throws if Hasher throws', async () => {
    const spy = hasherSpy as HasherSpy;
    spy.throwsError();

    const promise = sut.add(newUser);

    await expect(promise).rejects.toThrow();
  });

  it('should call AddUserRepository with the correct values', async () => {
    const addUser = configNewUser();

    const spy = addUserRepositorySpy as AddUserRepositorySpy;

    await sut.add(addUser);

    expect(spy.parameters).toEqual(addUser);
  });

  it('should throws if AddUserRepository throws', async () => {
    const spy = addUserRepositorySpy as AddUserRepositorySpy;
    spy.throwsError();

    const promise = sut.add(newUser);

    await expect(promise).rejects.toThrow();
  });

  it('should return a new User if success to persistent', async () => {
    const addUser = configNewUser();

    const spy = addUserRepositorySpy as AddUserRepositorySpy;
    spy.return = right(addUser);

    const response = await sut.add(newUser);

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual(addUser);
  });

  it('should return PersistencyError if fall to persistent', async () => {
    const spy = addUserRepositorySpy as AddUserRepositorySpy;
    spy.return = spy.returns.left;

    const result = await sut.add(newUser);

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(
      new PersistencyError('any_message', {}, 'any_value')
    );
  });
});
