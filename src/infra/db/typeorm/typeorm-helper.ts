import { env } from '@/shared/config'
import {
  createConnection,
  Connection,
  Repository,
  EntityTarget,
  QueryRunner
} from 'typeorm'

export class TypeORMHelpers {
  private static connection: Connection

  static async getConnection(): Promise<Connection> {
    if (!TypeORMHelpers.connection?.isConnected) {
      await TypeORMHelpers.connect()
    }
    return TypeORMHelpers.connection
  }

  static async connect(): Promise<Connection> {
    let database = 'default'
    if (env.app.env === 'test') {
      database = 'test'
    } else if (env.app.env === 'production') {
      database = 'production'
    }

    TypeORMHelpers.connection = await createConnection(database)
    return TypeORMHelpers.connection
  }

  static async getRepository<Entity>(
    entity: EntityTarget<Entity>
  ): Promise<Repository<Entity>> {
    if (!TypeORMHelpers.connection?.isConnected) {
      await TypeORMHelpers.connect()
    }
    return TypeORMHelpers.connection.getRepository(entity)
  }

  static async createQueryRunner(): Promise<QueryRunner> {
    if (!TypeORMHelpers.connection?.isConnected) {
      await TypeORMHelpers.connect()
    }
    const queryRunner = TypeORMHelpers.connection.createQueryRunner()
    await queryRunner.connect()

    return queryRunner
  }

  static async disconnect(): Promise<void> {
    if (!TypeORMHelpers.connection?.isConnected) {
      await TypeORMHelpers.connection.close()
    }
    TypeORMHelpers.connection = null
  }

  static async clearDataBase(): Promise<void> {
    const connection = await TypeORMHelpers.getConnection()
    const entities = connection.entityMetadatas

    await Promise.all(
      entities.map(async entity => {
        const repository = connection.getRepository(entity.name)
        await repository.query(`DELETE FROM ${entity.tableName}`)
      })
    )
  }
}
