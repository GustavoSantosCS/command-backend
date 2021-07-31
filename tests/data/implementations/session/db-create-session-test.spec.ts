import { Encrypter, HashComparer } from '@/data/protocols';
import { CreateSessionUseCase } from '@/domain/usecases';
import { DBCreateSession } from '@/data/implementations';
import { UserEntity } from '@/data/entities';
import { throwError } from '@tests/shared';
import { SearchUserByEmailRepositorySpy } from '@tests/infra/mock/db/user';
import { FailedLoginError } from '@/domain/errors';
import { makeMockUser } from '@tests/domain/mock/models';
// Sub
class HashComparerSub implements HashComparer {
  async compare(plaitext: string, hash: string): Promise<boolean> {
    return true;
  }
}

class EncrypterSub implements Encrypter {
  return = 'encrypt';
  parameters;
  async encrypt(payloadBody: any): Promise<string> {
    this.parameters = payloadBody;
    return 'encrypt';
  }
}

let sut: DBCreateSession;
let repository: SearchUserByEmailRepositorySpy;
let comparatorHasher: HashComparer;
let userFind: UserEntity;
let encrypter: Encrypter;
let request: CreateSessionUseCase.Params;

describe('Test Unit: DBCreateSession', () => {
  beforeEach(() => {
    userFind = makeMockUser({ id: true, avatar: true });
    repository = new SearchUserByEmailRepositorySpy();
    repository.return = userFind;
    comparatorHasher = new HashComparerSub();
    encrypter = new EncrypterSub();
    request = {
      email: userFind.email,
      password: `${userFind.password}-hash`
    };
    sut = new DBCreateSession(repository, comparatorHasher, encrypter);
  });

  it('should call SearchUserByEmailRepository with the correct values', async () => {
    const spy = jest.spyOn(repository, 'searchByEmail');

    await sut.createSession(request);

    expect(spy).toBeCalledWith(request.email);
  });

  it('should throws if SearchUserByEmailRepository throws', async () => {
    jest.spyOn(repository, 'searchByEmail').mockImplementation(throwError);

    const promise = sut.createSession(request);

    expect(promise).rejects.toThrow();
  });

  it('should return error if SearchUserByEmailRepository return null', async () => {
    const spy = repository as SearchUserByEmailRepositorySpy;
    spy.return = null;

    const result = await sut.createSession(request);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new FailedLoginError(request));
  });

  it('should call HashComparer with the correct values', async () => {
    const spy = jest.spyOn(comparatorHasher, 'compare');

    await sut.createSession(request);

    expect(spy).toBeCalledWith(request.password, userFind.password);
  });

  it('should return error if HashComparer return false', async () => {
    jest
      .spyOn(comparatorHasher, 'compare')
      .mockImplementationOnce(async () => false);

    const result = await sut.createSession(request);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new FailedLoginError(request));
  });

  it('should throws if HashComparer throws', async () => {
    jest.spyOn(comparatorHasher, 'compare').mockImplementation(throwError);

    const promise = sut.createSession(request);

    expect(promise).rejects.toThrow();
  });

  it('should call Encrypter with the correct values', async () => {
    const spy = encrypter as EncrypterSub;

    await sut.createSession(request);

    expect(spy.parameters.body).toEqual({ id: userFind.id });
  });

  it('should throws if Encrypter throws', async () => {
    jest.spyOn(encrypter, 'encrypt').mockImplementation(throwError);

    const promise = sut.createSession(request);

    expect(promise).rejects.toThrow();
  });

  it('should return success if success', async () => {
    const result = await sut.createSession(request);

    expect(result.isRight()).toBeTruthy();
    const value = result.value as CreateSessionUseCase.Return;
    const aux = userFind;
    delete aux.password;
    expect(value.user).toEqual(aux);
    expect(value.token).toEqual((encrypter as EncrypterSub).return);
  });
});
