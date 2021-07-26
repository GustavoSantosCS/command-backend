import { AccountEntity, UserEntity } from '@/data/entities';
import {
  AddAccountRepository,
  GetAccountByIdRepository,
  GetAllUserAccountRepository
} from '@/data/protocols';
import { AccountModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class AccountTypeOrmRepository
  implements
    AddAccountRepository,
    GetAccountByIdRepository,
    GetAllUserAccountRepository
{
  async add(
    account: Omit<AccountModel, 'client'>,
    userId: string
  ): Promise<AccountEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const userFound = await queryRunner.manager.findOne(UserEntity, userId);

      let newAccount = new AccountEntity(account as AccountModel);
      newAccount.client = userFound;
      newAccount = await queryRunner.manager.save(newAccount);

      await queryRunner.manager.save(userFound);
      await queryRunner.commitTransaction();

      delete newAccount.establishment.manager;
      delete newAccount.establishment.image;

      return newAccount;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('AccountTypeOrmRepository:31 => ', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getById(accountId: string): Promise<GetAccountByIdRepository.Result> {
    const repository = await TypeORMHelpers.getRepository(AccountEntity);
    const accountFound = await repository.findOne(accountId);
    return accountFound;
  }

  async getAllUserAccount(
    userId: string
  ): Promise<
    Omit<AccountEntity, 'user' | 'requestsProduct' | 'requestsMusic'>[]
  > {
    const repo = await TypeORMHelpers.getRepository(AccountEntity);
    const query = repo
      .createQueryBuilder('accounts')
      .innerJoin('accounts.client', 'users')
      .innerJoinAndSelect('accounts.establishment', 'establishments')
      .where('users.id = :userId', { userId });
    const accounts = await query.getMany();
    return accounts;
  }
}
