import { AccountEntity } from '@/data/entities';
import {
  AddAccountRepository,
  GetAccountByIdRepository,
  GetAllUserAccountRepository
} from '@/data/protocols';
import { TypeORMHelpers } from './typeorm-helper';

export class AccountTypeOrmRepository
  implements
    AddAccountRepository,
    GetAccountByIdRepository,
    GetAllUserAccountRepository
{
  async add(account: AccountEntity): Promise<AccountEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      await queryRunner.manager.save(account);
      await queryRunner.commitTransaction();

      return account;
    } catch (err) {
      // eslint-disable-next-line no-console
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
  ): Promise<Omit<AccountEntity, 'requestsProduct' | 'requestsMusic'>[]> {
    const repo = await TypeORMHelpers.getRepository(AccountEntity);
    const query = repo
      .createQueryBuilder('accounts')
      .innerJoinAndSelect('accounts.client', 'users')
      .innerJoin('accounts.establishment', 'establishments')
      .where('users.id = :userId', { userId });
    const accounts = await query.getMany();
    return accounts;
  }
}
