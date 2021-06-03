import { DBAddAccount } from '@/data/implementations/account';
import {
  IDGenerator,
  AddAccountRepository,
  SearchAccountByEmailRepository
} from '@/data/protocols';
import { Hasher } from '@/data/protocols/cryptography';
import { EmailAlreadyUseError } from '@/domain/errors';
import { Account } from '@/domain/models';
import { InternalServerError } from '@/presentation/errors';
import { makeMockAddAccount } from '@tests/domain/mock/models';
import { IdGeneratorSpy } from '@tests/infra/mock';
import { HasherSpy } from '@tests/infra/mock/cryptography';
import {
  AddAccountRepositorySpy,
  SearchAccountByEmailRepositorySpy
} from '@tests/infra/mock/db/account';

let sut: DBAddAccount;
let idGeneratorSpy: IDGenerator;
let hasherSpy: Hasher;
let searchByEmailRepositorySpy: SearchAccountByEmailRepository;
let addAccountRepositorySpy: AddAccountRepository;
let newAccount: Omit<Account, 'id'>;

describe('Test Unit: DBAddAccount', () => {
  beforeEach(() => {
    newAccount = makeMockAddAccount();
    idGeneratorSpy = new IdGeneratorSpy();
    searchByEmailRepositorySpy = new SearchAccountByEmailRepositorySpy();
    addAccountRepositorySpy = new AddAccountRepositorySpy();
    hasherSpy = new HasherSpy();

    sut = new DBAddAccount(
      idGeneratorSpy,
      hasherSpy,
      searchByEmailRepositorySpy,
      addAccountRepositorySpy
    );
  });

  it('should call SearchAccountByEmailRepository with the correct values', async () => {
    const spy = searchByEmailRepositorySpy as SearchAccountByEmailRepositorySpy;

    await sut.add(newAccount);

    expect(spy.parameters).toEqual(newAccount.email);
  });

  it('should return EmailAlreadyUseError if email already use', async () => {
    const spy = searchByEmailRepositorySpy as SearchAccountByEmailRepositorySpy;
    spy.return = spy.returns.right;

    const response = await sut.add(newAccount);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new EmailAlreadyUseError(newAccount.email));
  });

  it('should call generator id', async () => {
    const spy = idGeneratorSpy as IdGeneratorSpy;

    await sut.add(newAccount);

    expect(spy.callQuantity).toBe(1);
  });

  it('should return InternalServerError if IdGenerator throws', async () => {
    const spy = idGeneratorSpy as IdGeneratorSpy;
    spy.throwsError();

    const response = await sut.add(newAccount);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InternalServerError('any_message'));
  });

  it('should call Hasher with the correct values', async () => {
    const spy = hasherSpy as HasherSpy;

    await sut.add(newAccount);

    expect(spy.parameters).toEqual(newAccount.password);
  });

  it('should return InternalServerError if Hasher throws', async () => {
    const spy = hasherSpy as HasherSpy;
    spy.throwsError();

    const response = await sut.add(newAccount);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InternalServerError('any_message'));
  });
});
