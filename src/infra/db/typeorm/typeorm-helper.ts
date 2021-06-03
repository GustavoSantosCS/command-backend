import { createConnection, Connection, Repository, ObjectType } from 'typeorm';

export class TypeORMHelpers {
  private static connection: Connection = null;

  static async getConnection(): Promise<Connection> {
    if (!TypeORMHelpers.connection?.isConnected) {
      await TypeORMHelpers.connect();
    }
    return TypeORMHelpers.connection;
  }

  static async connect(): Promise<void> {
    if (String(process.env.NODE_ENV) === 'test') {
      TypeORMHelpers.connection = await createConnection('dev');
    } else {
      TypeORMHelpers.connection = await createConnection('default');
    }
  }
  static async getRepository<Entity>(
    entity: ObjectType<Entity>
  ): Promise<Repository<Entity>> {
    if (!TypeORMHelpers.connection?.isConnected) {
      await TypeORMHelpers.connect();
    }
    return TypeORMHelpers.connection.getRepository(entity);
  }

  static async disconnect(): Promise<void> {
    if (TypeORMHelpers.connection) {
      await TypeORMHelpers.connection.close();
      TypeORMHelpers.connection = null;
    }
  }

  static async clearDataBase(): Promise<void> {
    const connection = await TypeORMHelpers.getConnection();
    const entities = connection.entityMetadatas;

    await Promise.all(
      entities.map(async entity => {
        const repository = connection.getRepository(entity.name);
        await repository.query(`DELETE FROM ${entity.tableName}`);
      })
    );
  }
}
