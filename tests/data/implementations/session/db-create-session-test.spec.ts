import { Encrypter, HashComparer } from '@/data/protocols';
import { CreateSessionUseCase } from '@/domain/usecases';
import { DBCreateSession } from '@/data/implementations';
import { UserEntity } from '@/data/entities';
import { makeMockUserEntity } from '@tests/data/mock/entities';
import { throwError } from '@tests/shared';
import { UserModel } from '@/domain/models';
import { SearchUserByEmailRepositorySpy } from '@tests/infra/mock/db/user';
import { LoginError } from '@/presentation/errors/login-error';
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
let data: UserEntity;
let encrypter: Encrypter;
let request: CreateSessionUseCase.Params;

describe('Test Unit: DBCreateSession', () => {
  beforeEach(() => {
    data = makeMockUserEntity();
    repository = new SearchUserByEmailRepositorySpy();
    repository.return = data;
    comparatorHasher = new HashComparerSub();
    encrypter = new EncrypterSub();
    request = {
      email: data.email,
      password: `${data.password}-hash`
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
    expect(result.value).toEqual(new LoginError(request));
  });

  it('should call HashComparer with the correct values', async () => {
    const spy = jest.spyOn(comparatorHasher, 'compare');

    await sut.createSession(request);

    expect(spy).toBeCalledWith(request.password, data.password);
  });

  it('should return error if HashComparer return false', async () => {
    jest
      .spyOn(comparatorHasher, 'compare')
      .mockImplementationOnce(async () => false);

    const result = await sut.createSession(request);
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toEqual(new LoginError(request));
  });

  it('should throws if HashComparer throws', async () => {
    jest.spyOn(comparatorHasher, 'compare').mockImplementation(throwError);

    const promise = sut.createSession(request);

    expect(promise).rejects.toThrow();
  });

  it('should call Encrypter with the correct values', async () => {
    const spy = encrypter as EncrypterSub;

    await sut.createSession(request);

    expect(spy.parameters.body).toEqual({ id: data.id });
  });

  it('should throws if Encrypter throws', async () => {
    jest.spyOn(encrypter, 'encrypt').mockImplementation(throwError);

    const promise = sut.createSession(request);

    expect(promise).rejects.toThrow();
  });

  it('should return success if success', async () => {
    const returnOfUseCase: Omit<UserModel, 'password'> = { ...(data as any) };

    const result = await sut.createSession(request);

    expect(result.isRight()).toBeTruthy();
    const { value } = result;

    expect((value as any).user).toEqual(returnOfUseCase);
    expect((value as any).token).toEqual((encrypter as EncrypterSub).return);
  });
});
