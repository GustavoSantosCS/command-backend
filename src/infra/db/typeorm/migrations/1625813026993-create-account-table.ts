import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateAccountTable1625813026993 implements MigrationInterface {
  tableName = 'accounts'
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'establishment_id', type: 'uuid' },
          { name: 'client_id', type: 'uuid' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
          { name: 'closed_at', type: 'timestamp', isNullable: true }
        ],
        foreignKeys: [
          {
            columnNames: ['establishment_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'establishments',
            name: 'account_establishment_fk' // Nome da ForeignKey
          },
          {
            columnNames: ['client_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            name: 'account_user_fk' // Nome da ForeignKey
          }
        ]
      }),
      false
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(this.tableName)

    const foreignKey1 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('account_establishment_fk')
    )

    const foreignKey2 = table.foreignKeys.find(fk =>
      fk.columnNames.includes('account_user_fk')
    )

    await queryRunner.dropForeignKeys(this.tableName, [
      foreignKey1,
      foreignKey2
    ])

    await queryRunner.dropTable(this.tableName)
  }
}
