import { AccountEntity, UserEntity } from '@/data/entities';
import { AddAccountRepository } from '@/data/protocols';
import { AccountModel } from '@/domain/models';
import { TypeORMHelpers } from './typeorm-helper';

export class AccountTypeOrmRepository implements AddAccountRepository {
  async add(
    account: Omit<AccountModel, 'client'>,
    idUser: string
  ): Promise<AccountEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const trackedUser = await queryRunner.manager.findOne(
        UserEntity,
        idUser,
        { relations: ['accounts'] }
      );
      let newAccount = new AccountEntity(account as AccountModel);
      newAccount.client = trackedUser;
      newAccount = await queryRunner.manager.save(newAccount);

      trackedUser.accounts.push(newAccount);
      await queryRunner.manager.save(trackedUser);

      await queryRunner.commitTransaction();
      return newAccount;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('AccountTypeOrmRepository:31 => ', err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return null;
  }
}
