import { DBAddAccount } from '@/data/implementations/account';
import {
  IDGenerator,
  AddAccountRepository,
  SearchAccountByEmailRepository
} from '@/data/protocols';
import { EmailAlreadyUseError } from '@/domain/errors';
import { Account } from '@/domain/models';
import { InternalServerError } from '@/presentation/errors';
import { makeMockAddAccount } from '@tests/domain/models';
import { IdGeneratorSpy } from '@tests/infra/adapter';
import {
  AddAccountRepositorySpy,
  SearchAccountByEmailRepositorySpy
} from '@tests/infra/db/account';

let sut: DBAddAccount;
let idGeneratorSpy: IDGenerator;
let searchByEmailRepositorySpy: SearchAccountByEmailRepository;
let addAccountRepositorySpy: AddAccountRepository;
let newAccount: Omit<Account, 'id'>;

describe('Test Unit: DBAddAccount', () => {
  beforeEach(() => {
    newAccount = makeMockAddAccount();
    idGeneratorSpy = new IdGeneratorSpy();
    searchByEmailRepositorySpy = new SearchAccountByEmailRepositorySpy();
    addAccountRepositorySpy = new AddAccountRepositorySpy();

    sut = new DBAddAccount(
      idGeneratorSpy,
      searchByEmailRepositorySpy,
      addAccountRepositorySpy
    );
  });

  it('should call generator id', async () => {
    const spy = idGeneratorSpy as IdGeneratorSpy;

    await sut.add(newAccount);

    expect(spy.callQuantity).toBe(1);
  });

  it('should return IDGeneratorFallError if idGenerator throws', async () => {
    const spy = idGeneratorSpy as IdGeneratorSpy;
    spy.throwsError();

    const response = await sut.add(newAccount);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InternalServerError('any_message'));
  });

  it('should call SearchAccountByEmailRepository with the correct values', async () => {
    const spy = searchByEmailRepositorySpy as SearchAccountByEmailRepositorySpy;

    await sut.add(newAccount);

    expect(spy.parameters).toEqual(newAccount.email);
  });

  it('should return EmailAlreadyUseError if email already use', async () => {
    const response = await sut.add(newAccount);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new EmailAlreadyUseError(newAccount.email));
  });
});
