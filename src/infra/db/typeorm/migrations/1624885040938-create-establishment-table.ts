import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateEstablishmentTable1624885040938
  implements MigrationInterface
{
  tableName = 'establishments'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'category', type: 'varchar' },
          { name: 'description', type: 'varchar' },
          { name: 'isOpen', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'manager', type: 'uuid' }
        ],
        foreignKeys: [
          {
            columnNames: ['manager'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            name: 'user_establishments_fk'
          }
        ]
      }),
      false
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)
    const foreignKey = table.foreignKeys.find(fk =>
      fk.columnNames.includes('user_establishments_fk')
    )
    await queryRunner.dropForeignKey(this.tableName, foreignKey)
    await queryRunner.dropTable(this.tableName)
  }
}
