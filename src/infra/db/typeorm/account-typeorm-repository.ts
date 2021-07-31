import { AccountEntity } from '@/data/entities'
import {
  AddAccountRepository,
  GetAccountByIdRepository,
  GetAllUserAccountRepository
} from '@/data/protocols'
import { TypeORMHelpers } from './typeorm-helper'

export class AccountTypeOrmRepository
implements
    AddAccountRepository,
    GetAccountByIdRepository,
    GetAllUserAccountRepository {
  async save (account: AccountEntity): Promise<AccountEntity> {
    const queryRunner = await TypeORMHelpers.createQueryRunner()
    try {
      await queryRunner.startTransaction()

      await queryRunner.manager.save(account)
      await queryRunner.commitTransaction()

      return account
    } catch (err) {
      // eslint-disable-next-line no-console
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async getById (
    accountId: string,
    config?: GetAccountByIdRepository.Config
  ): Promise<AccountEntity> {
    const repository = await TypeORMHelpers.getRepository(AccountEntity)
    let queryBuilder = repository.createQueryBuilder('accounts')

    if (config?.withClient) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'accounts.client',
        'users'
      )
    }

    if (config?.withEstablishment) {
      queryBuilder = queryBuilder.innerJoinAndSelect(
        'accounts.establishment',
        'establishments'
      )
    }

    queryBuilder = queryBuilder.where('accounts.id = :accountId', {
      accountId
    })

    const account = await queryBuilder.getOne()
    return account
  }

  async getAllUserAccount (
    userId: string
  ): Promise<Array<Omit<AccountEntity, 'requestsProduct'>>> {
    const repo = await TypeORMHelpers.getRepository(AccountEntity)
    const query = repo
      .createQueryBuilder('accounts')
      .innerJoinAndSelect('accounts.client', 'users')
      .innerJoin('accounts.establishment', 'establishments')
      .where('users.id = :userId', { userId })
    const accounts = await query.getMany()
    return accounts
  }
}
